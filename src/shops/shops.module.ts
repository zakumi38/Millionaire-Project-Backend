import { Module } from "@nestjs/common"
import { ShopsService } from "./shops.service"
import { ShopsController } from "./shops.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Shop } from "./entities/shop.entity"

@Module({
    controllers: [ShopsController],
    providers: [ShopsService],
    imports: [TypeOrmModule.forFeature([Shop])],
})
export class ShopsModule {}
