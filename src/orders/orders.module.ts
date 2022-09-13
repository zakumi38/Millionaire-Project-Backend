import { Module } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { OrdersController } from "./orders.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Order } from "./entities/order.entity"
import { Rider } from "../riders/entities/rider.entity"
import { Customer } from "../customers/entities/customer.entity"
import { Food } from "../foods/entities/food.entity"

@Module({
    controllers: [OrdersController],
    providers: [OrdersService],
    imports: [TypeOrmModule.forFeature([Order, Rider, Customer, Food])],
})
export class OrdersModule {}
