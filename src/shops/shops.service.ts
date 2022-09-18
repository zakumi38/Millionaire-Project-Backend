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
        return this.commonService.create(createShopDto, {
            ...createShopDto.foods,
        })
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

    async remove(id: number): Promise<Shop> {
        return this.commonService.remove(id)
    }

    /*
    Filters all the incomingFoods from the UpdateShopDto
    Entities with ids are updated,
    Get entities that aren't in incomingFoods
    And without Ids are saved,
     */
    private async preloadUpdatingFood(
        shopId: number,
        incomingFoods: Food[]
    ): Promise<Food[]> {
        // Handling Foods with Ids
        const incomingFoodsWithIds: Food[] = incomingFoods.filter(
            (food) => food.id
        )

        // Getting Foods that aren't in the incomingFoods excluding the incomingFoods with ids
        const existingFoods = await this.foodRepository
            .createQueryBuilder("food")
            .where("food.shop_id = :id", { id: shopId })
            .andWhere(
                `food.id NOT IN (${incomingFoodsWithIds.map(
                    (item) => item.id
                )})`
            )
            .orderBy("food.id")
            .getMany()

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
}
