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
    currentOrder: Order
    createdDate: Date
    deliveryPercentage: number
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
        const orderedFoodIds = createOrderDto.orderedItems.map(
            (item) => item.id
        )
        const preloadedOrderedFoods = await this.preloadFoods(orderedFoodIds)
        return this.modifyOrder(
            await this.commonService.create(createOrderDto, {
                foods: preloadedOrderedFoods,
                orderedItems: createOrderDto.orderedItems,
            })
        )
    }

    async findAll(): Promise<ModifiedOrder[]> {
        const orders = await this.commonService.findAll([
            "customer",
            "foods",
            "rider",
        ])
        return Promise.all(orders.map((order) => this.modifyOrder(order)))
    }

    async findOne(id: number): Promise<ModifiedOrder> {
        return this.modifyOrder(
            await this.commonService.findOne(id, ["customer", "foods", "rider"])
        )
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

    private async preloadFoods(orderedItems): Promise<Food[]> {
        // Find the orderedItems[] in food
        const foods = await this.foodRepository.findBy({
            id: In(orderedItems),
        })
        // For storing the ids tht weren't able to find
        const notFoundIds = []
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
     * @param orderedItems The quantity entity
     * @param foods The orderedItems entity
     * @private
     */
    private async mergeOrderItemsWithQuantities(
        orderedItems,
        foods
    ): Promise<ModifiedOrderedItems[]> {
        return orderedItems.map((quantity) => {
            const createdOrderedItem: Food = foods.find(
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
            isCanceled,
            isCompleted,
            destination,
            rider,
            orderedItems,
            customer,
            currentOrder,
            createdDate,
            deliveryPercentage,
            foods,
        } = order
        return {
            id,
            isCanceled,
            isCompleted,
            destination,
            rider,
            orderedItems: await this.mergeOrderItemsWithQuantities(
                orderedItems,
                foods
            ),
            customer,
            currentOrder,
            createdDate,
            deliveryPercentage,
        }
    }
}
