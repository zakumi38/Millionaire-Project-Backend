import { Module } from "@nestjs/common";
import { RidersService } from "./riders.service";
import { RidersController } from "./riders.controller";

@Module({
  controllers: [RidersController],
  providers: [RidersService]
})
export class RidersModule {
}
