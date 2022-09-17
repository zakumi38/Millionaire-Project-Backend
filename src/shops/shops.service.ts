import { Injectable } from "@nestjs/common"
import { CreateShopDto } from "./dto/create-shop.dto"
import { UpdateShopDto } from "./dto/update-shop.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Shop } from "./entities/shop.entity"
import { Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import CommonService from "../common/common.service"

@Injectable()
export class ShopsService {
    private readonly commonService: CommonService

    constructor(
        @InjectRepository(Shop)
        private readonly shopRepository: Repository<Shop>,
        @InjectRepository(Food)
        private readonly foodRepository: Repository<Food>
    ) {
        this.commonService = new CommonService(shopRepository, "Shop")
    }

    async create(createShopDto: CreateShopDto): Promise<Shop> {
        // Check if createShopDto includes foods, if true find all those foods
        const foods =
            createShopDto.foods &&
            (await Promise.all(
                createShopDto.foods.map((food) => this.preloadFood(food))
            ))
        return this.commonService.create(createShopDto, { foods })
    }

    findAll(): Promise<Shop[]> {
        return this.commonService.findAll("foods")
    }

    async findOne(id: number): Promise<Shop> {
        return this.commonService.findOne(id, "foods")
    }

    async update(id: number, updateShopDto: UpdateShopDto): Promise<Shop> {
        const { name, location, latitudeLongitude } = updateShopDto

        // Check if createShopDto includes foods id, if true find all those foods
        return this.commonService.update(id, {
            name,
            location,
            latitudeLongitude,
            foods: await this.preloadUpdatingFood(id, updateShopDto.foods),
        })
    }

    private async preloadFood(food: Food): Promise<Food> {
        const existingFood = this.foodRepository.findOne({ where: { ...food } })
        return existingFood && this.foodRepository.create({ ...food })
    }

    /*
    Filters all the incomingFoods from the UpdateShopDto
    Entities with ids are updated,
    Get entities that aren't in incomingFoods 
    And without Ids are saved,
     */
    private async preloadUpdatingFood(
        shopId: number,
        incomingFoods
    ): Promise<Food[]> {
        // Handling Foods with Ids
        const incomingFoodsWithIds: Food[] = incomingFoods.filter(
            (food) => food.id
        )

        // Getting Foods that aren't in the incomingFoods excluding the incoming with ids
        const existingFoods = await this.foodRepository.query(
            `SELECT *
             FROM "food"
             WHERE (("food"."shop_id" = ${shopId}))
               AND food.id NOT IN (${incomingFoodsWithIds.map(
                   (item) => item.id
               )})`
        )

        // Handling Foods without Ids
        const createdFoodsWithoutIds = this.foodRepository.create(
            incomingFoods.filter((food) => !food.id)
        )
        await this.foodRepository.save(createdFoodsWithoutIds)

        return [
            ...incomingFoodsWithIds,
            ...createdFoodsWithoutIds,
            ...existingFoods,
        ]
    }

    async remove(id: number): Promise<Shop> {
        return this.commonService.remove(id)
    }
}
