import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Order } from "./entities/order.entity"
import { In, Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Food)
        private readonly foodRepository: Repository<Food>
    ) {}

    async create(createOrderDto: CreateOrderDto) {
        const foods = await this.foodRepository.findBy({
            id: In(createOrderDto.orderedItems),
        })
        const newOrder = this.orderRepository.create({
            ...createOrderDto,
            orderedItems: foods,
        })
        return this.orderRepository.save(newOrder)
    }

    findAll() {
        return this.orderRepository.find({
            order: { id: "ASC" },
            relations: ["customer", "orderedItems", "rider"],
        })
    }

    async findOne(id: number) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ["customer", "orderedItems", "rider"],
        })
        if (!order) throw new NotFoundException(`Order #${id} cannot be found`)
        return order
    }

    async update(id: number, updateOrderDto: UpdateOrderDto) {
        const foods = await this.foodRepository.findBy({
            id: In(updateOrderDto.orderedItems),
        })
        // Update the entities except customer
        const { rider, isCompleted, destination } = updateOrderDto
        const order = await this.orderRepository.preload({
            id,
            rider,
            isCompleted,
            destination,
            orderedItems: foods,
        })
        if (!order)
            throw new NotFoundException(
                `Order #${id} cannot be updated because it doesn't exist`
            )
        return this.orderRepository.save(order)
    }

    async remove(id: number) {
        const order = await this.orderRepository.findOne({
            where: { id },
        })
        if (!order)
            throw new NotFoundException(
                `Order #${id} have already been deleted or doesn't exist`
            )
        return this.orderRepository.remove(order)
    }
}
