import { Module } from "@nestjs/common"
import { RidersService } from "./riders.service"
import { RidersController } from "./riders.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Rider } from "./entities/rider.entity"

@Module({
    controllers: [RidersController],
    providers: [RidersService],
    imports: [TypeOrmModule.forFeature([Rider])],
    exports: [RidersService],
})
export class RidersModule {}
