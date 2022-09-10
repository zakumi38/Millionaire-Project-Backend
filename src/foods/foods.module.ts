import { Module } from "@nestjs/common";
import { FoodsService } from "./foods.service";
import { FoodsController } from "./foods.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Food } from "./entities/food.entity";

@Module({
    controllers: [FoodsController],
    providers: [FoodsService],
    imports: [TypeOrmModule.forFeature([Food])]
})
export class FoodsModule {
}
