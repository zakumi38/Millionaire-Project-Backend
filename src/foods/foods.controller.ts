import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common"
import { FoodsService } from "./foods.service"
import { CreateFoodDto } from "./dto/create-food.dto"
import { UpdateFoodDto } from "./dto/update-food.dto"

@Controller("foods")
export class FoodsController {
    constructor(private readonly foodsService: FoodsService) {}

    @Post()
    create(@Body() createFoodDto: CreateFoodDto) {
        return this.foodsService.create(createFoodDto)
    }

    @Get()
    findAll() {
        return this.foodsService.findAll()
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.foodsService.findOne(+id)
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateFoodDto: UpdateFoodDto) {
        return this.foodsService.update(+id, updateFoodDto)
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.foodsService.remove(+id)
    }
}
