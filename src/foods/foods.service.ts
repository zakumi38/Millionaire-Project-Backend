import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateFoodDto } from "./dto/create-food.dto"
import { UpdateFoodDto } from "./dto/update-food.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Food } from "./entities/food.entity"
import { Repository } from "typeorm"
import CommonService from "../common/common.service"

@Injectable()
export class FoodsService {
    private readonly commonService: CommonService

    constructor(
        @InjectRepository(Food)
        private readonly foodRepository: Repository<Food>
    ) {
        this.commonService = new CommonService(foodRepository, "Food")
    }

    create(createFoodDto: CreateFoodDto): Promise<Food> {
        return this.commonService.create(createFoodDto)
    }

    findAll(): Promise<Food[]> {
        return this.commonService.findAll("shop")
    }

    async findOne(id: number): Promise<Food> {
        return this.commonService.findOne(id, "shop")
    }

    async update(id: number, updateFoodDto: UpdateFoodDto) {
        const food = await this.foodRepository.preload({
            id,
            ...updateFoodDto,
        })
        if (!food)
            throw new NotFoundException(
                `Food #${id} cannot be updated because it doesn't exist`
            )
        return this.foodRepository.save(food)
    }

    async remove(id: number): Promise<Food> {
        return this.commonService.remove(id)
    }
}
