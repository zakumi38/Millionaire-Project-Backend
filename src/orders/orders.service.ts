import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Order } from "./entities/order.entity"
import { In, Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import CommonService from "../common/common.service"

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

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const newOrder = this.orderRepository.create({
            ...createOrderDto,
            orderedItems: await this.preloadFoods(createOrderDto.orderedItems),
        })
        return this.orderRepository.save(newOrder)
    }

    findAll(): Promise<Order[]> {
        return this.commonService.findAll(["customer", "orderedItems", "rider"])
    }

    async findOne(id: number) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ["customer", "orderedItems", "rider"],
        })
        if (!order) throw new NotFoundException(`Order #${id} cannot be found`)
        return order
    }

    async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
        // Update the entities except customer
        const { rider, isCompleted, destination } = updateOrderDto
        const order = await this.orderRepository.preload({
            id,
            rider,
            isCompleted,
            destination,
            orderedItems: await this.preloadFoods(updateOrderDto.orderedItems),
        })
        if (!order)
            throw new NotFoundException(
                `Order #${id} cannot be updated because it doesn't exist`
            )
        return this.orderRepository.save(order)
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
}
