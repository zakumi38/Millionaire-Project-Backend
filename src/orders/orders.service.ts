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
    isCanceled: boolean
    createdDate: Date
    deliveryPercentage: number
    destination: string
    shop: Shop[]
    id: number
    rider: Rider
    currentOrder: Order
    isCompleted: boolean
    customer: Customer
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

    async create(createOrderDto: CreateOrderDto): Promise<ModifiedOrder> {
        const orderedFoodIds = createOrderDto.orderedItems.map(
            (item) => item.id
        )
        const preloadedOrderedFoods = await this.preloadFoods(orderedFoodIds)
        return await this.commonService.create(createOrderDto, {
            foods: preloadedOrderedFoods,
            orderedItems: createOrderDto.orderedItems,
        })
    }

    async findAll(): Promise<ModifiedOrder[]> {
        const orders = await this.commonService.findAll([
            "customer",
            "foods",
            "rider",
            "foods.shop",
        ])
        return Promise.all(orders.map((order) => this.modifyOrder(order)))
    }

    async findOne(id: number): Promise<ModifiedOrder> {
        return this.modifyOrder(
            await this.commonService.findOne(id, [
                "customer",
                "foods",
                "rider",
                "foods.shop",
            ])
        )
    }

    async update(
        id: number,
        updateOrderDto: UpdateOrderDto
    ): Promise<ModifiedOrder> {
        // Update the entities except customer
        // This is important
        const { rider, isCompleted, destination, orderedItems } = updateOrderDto
        const orderedFoodIds = orderedItems.map((item) => item.id)
        const preloadOrderedFoods = await this.preloadFoods(orderedFoodIds)
        return this.commonService.update(id, {
            rider,
            isCompleted,
            destination,
            foods: preloadOrderedFoods,
            orderedItems: updateOrderDto.orderedItems,
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

    private async extractShops(orderedItems) {
        let shops: Shop[] = [],
            uniqueShops: Shop[] = []
        // Get all the shops from the ordered Foods
        orderedItems.map((item) => {
            shops.push(item.shop)
            item.shop = item.shop.id
        })
        // Filter the shops to get unique ones
        shops.map((shop) => {
            uniqueShops.findIndex((uniqueShop) => uniqueShop.id === shop.id) ===
                -1 && uniqueShops.push(shop)
        })

        // Nesting foods in those unique shops
        uniqueShops.map((uniqueShop) => {
            let foodsOfShop = orderedItems.filter((orderedItem) => {
                return orderedItem.shop === uniqueShop.id
            })
            foodsOfShop.map((foodOfShop) => {
                delete foodOfShop.shop
            })
            uniqueShop.foods = [...foodsOfShop]
        })
        return uniqueShops
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
        const modifiedOrderedItems = await this.mergeOrderItemsWithQuantities(
            orderedItems,
            foods
        )
        return {
            id,
            isCanceled,
            isCompleted,
            destination,
            rider,
            shop: await this.extractShops(modifiedOrderedItems),
            customer,
            currentOrder,
            createdDate,
            deliveryPercentage,
        }
    }
}
