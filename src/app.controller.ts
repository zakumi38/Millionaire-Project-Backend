import { Controller, Get, UseGuards } from "@nestjs/common"
import { AppService } from "./app.service"
import { RouteGuard } from "./auth/guards/custom-route.guard"

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @UseGuards(RouteGuard)
    @Get()
    getHello(): string {
        return this.appService.getHello()
    }
}
