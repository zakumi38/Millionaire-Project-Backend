import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateShopDto } from "./dto/create-shop.dto"
import { UpdateShopDto } from "./dto/update-shop.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Shop } from "./entities/shop.entity"
import { Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import CommonService from "../common/common.service"

@Injectable()
export class ShopsService extends CommonService {
    constructor(
        @InjectRepository(Shop)
        private readonly shopRepository: Repository<Shop>,
        @InjectRepository(Food)
        private readonly foodRepository: Repository<Food>
    ) {
        super(shopRepository)
    }

    async create(createShopDto: CreateShopDto) {
        // Check if createShopDto includes foods, if true find all those foods
        const foods =
            createShopDto.foods &&
            (await Promise.all(
                createShopDto.foods.map((food) => this.preloadFood(food))
            ))
        const newShop = this.shopRepository.create({
            ...createShopDto,
            ...foods,
        })
        return this.shopRepository.save(newShop)
    }

    findAll(): Promise<Shop[]> {
        return this.commonFindAll("foods")
    }

    async findOne(id: number) {
        const shop = await this.shopRepository.find({
            where: { id },
            relations: ["foods"],
        })
        if (!shop) throw new NotFoundException(`Shop #${id} cannot;; be found`)
        return shop
    }

    async update(id: number, updateShopDto: UpdateShopDto) {
        // Check if createShopDto includes foods id, if true find all those foods
        const foods =
            updateShopDto.foods &&
            (await Promise.all(
                updateShopDto.foods.map((food) => this.preloadFood(food))
            ))
        const shop = await this.shopRepository.preload({
            id,
            ...updateShopDto,
            ...foods,
        })
        if (!shop)
            throw new NotFoundException(
                `Shop #${id} cannot be updated because it doesn't exist`
            )
        return this.shopRepository.save(shop)
    }

    private async preloadFood(food: Food): Promise<Food> {
        const existingFood = this.foodRepository.findOne({ where: { ...food } })
        if (!existingFood)
            throw new NotFoundException(`Food #${food} cannot be found`)
        return this.foodRepository.create({ ...food })
    }

    async remove(id: number) {
        const shop = await this.shopRepository.findOne({
            where: { id },
        })
        if (!shop)
            throw new NotFoundException(
                `Rider #${id} have already been deleted or doesn't exist`
            )
        return this.shopRepository.remove(shop)
    }
}
