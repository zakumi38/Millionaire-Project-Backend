import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Order } from "./entities/order.entity"
import { In, Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import CommonService from "../common/common.service"
import { Customer } from "../customers/entities/customer.entity"
import { Rider } from "../riders/entities/rider.entity"
import { Shop } from "../shops/entities/shop.entity"

interface ModifiedOrderedItems {
    isAvailable: boolean
    quantity: number
    shop: Shop
    createdDate: Date
    price: number
    name: string
    description: string
    id: number
}

export interface ModifiedOrder {
    id: number
    customer: Customer
    rider: Rider
    orderedItems: ModifiedOrderedItems[]
    destination: string
    isCompleted: boolean
    isCanceled: boolean
}

@Injectable()
export class OrdersService {
    private readonly commonService: CommonService

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Food)
        private readonly foodRepository: Repository<Food>
    ) {
        this.commonService = new CommonService(orderRepository, "Order")
    }

    async create(createOrderDto: CreateOrderDto) {
        const preloadedOrderedItems = await this.preloadFoods(
            createOrderDto.orderedItems
        )
        return this.modifyOrder(
            await this.commonService.create(createOrderDto, {
                orderedItems: preloadedOrderedItems,
            })
        )
    }

    findAll(): Promise<Order[]> {
        return this.commonService.findAll(["customer", "orderedItems", "rider"])
    }

    async findOne(id: number): Promise<Order> {
        return this.commonService.findOne(id, [
            "customer",
            "orderedItems",
            "rider",
        ])
    }

    async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
        // Update the entities except customer
        // This is important
        const { rider, isCompleted, destination } = updateOrderDto
        const orderedItems = await this.preloadFoods(
            updateOrderDto.orderedItems
        )
        return this.commonService.update(id, {
            rider,
            isCompleted,
            destination,
            orderedItems,
        })
    }

    async remove(id: number): Promise<Order> {
        return this.commonService.remove(id)
    }

    private async preloadFoods(orderedItems: number[]): Promise<Food[]> {
        // Find the orderedItems[] in food
        const foods = await this.foodRepository.findBy({
            id: In(orderedItems),
        })
        // For storing the ids that weren't able to find
        let notFoundIds = []
        // Check the ids that weren't able to find and add them to notFoundIds
        orderedItems.map((id, index) => {
            if (!foods[index] && id !== foods[index]?.id) notFoundIds.push(id)
        })
        // Throw error if not found foods exists
        if (notFoundIds.length)
            throw new NotFoundException(
                `Ordered Item #${notFoundIds} cannot be found`
            )
        return foods
    }

    /**
     * Merge the separated OrderItems with Quantities
     * @param quantities The quantity entity
     * @param orderedItems The orderedItems entity
     * @private
     */
    private async mergeOrderItemsWithQuantities(
        quantities,
        orderedItems
    ): Promise<ModifiedOrderedItems[]> {
        return quantities.map((quantity) => {
            const createdOrderedItem: Food = orderedItems.find(
                (item) => item.id === quantity.id
            )
            return { ...quantity, ...createdOrderedItem }
        })
    }

    /**
     * Create a modified order to return
     * @param order
     * @private
     */
    private async modifyOrder(order: Order): Promise<ModifiedOrder> {
        const {
            id,
            customer,
            rider,
            orderedItems,
            quantities,
            destination,
            isCompleted,
            isCanceled,
        } = order
        return {
            id,
            customer,
            rider,
            orderedItems: await this.mergeOrderItemsWithQuantities(
                quantities,
                orderedItems
            ),
            destination,
            isCompleted,
            isCanceled,
        }
    }
}
