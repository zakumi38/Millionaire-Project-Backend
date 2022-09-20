import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common"
import { RidersService } from "./riders.service"
import { CreateRiderDto } from "./dto/create-rider.dto"
import { UpdateRiderDto } from "./dto/update-rider.dto"
import { LocalGuard } from "src/auth/guards/local-strategy.guard"
@UseGuards(LocalGuard)
@Controller("riders")
export class RidersController {
    constructor(private readonly ridersService: RidersService) {}

    @Post()
    create(@Body() createRiderDto: CreateRiderDto) {
        return this.ridersService.create(createRiderDto)
    }

    @Get()
    findAll() {
        return this.ridersService.findAll()
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.ridersService.findOne(+id)
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateRiderDto: UpdateRiderDto) {
        return this.ridersService.update(+id, updateRiderDto)
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.ridersService.remove(+id)
    }
}
