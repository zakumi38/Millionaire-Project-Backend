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
import { ShopsService } from "./shops.service"
import { CreateShopDto } from "./dto/create-shop.dto"
import { UpdateShopDto } from "./dto/update-shop.dto"
import { LocalGuard } from "src/auth/guards/local-strategy.guard"
@UseGuards(LocalGuard)
@Controller("shops")
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) {}

    @Post()
    create(@Body() createShopDto: CreateShopDto) {
        return this.shopsService.create(createShopDto)
    }

    @Get()
    findAll() {
        return this.shopsService.findAll()
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.shopsService.findOne(+id)
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateShopDto: UpdateShopDto) {
        return this.shopsService.update(+id, updateShopDto)
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.shopsService.remove(+id)
    }
}
