import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateShopDto } from "./dto/create-shop.dto"
import { UpdateShopDto } from "./dto/update-shop.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Shop } from "./entities/shop.entity"
import { Repository } from "typeorm"

@Injectable()
export class ShopsService {
    constructor(
        @InjectRepository(Shop)
        private readonly shopRepository: Repository<Shop>
    ) {}

    create(createShopDto: CreateShopDto) {
        const newShop = this.shopRepository.create({ ...createShopDto })
        return this.shopRepository.save(newShop)
    }

    findAll() {
        return this.shopRepository.find({ order: { id: "ASC" } })
    }

    async findOne(id: number) {
        const shop = await this.shopRepository.findOne({ where: { id } })
        if (!shop) throw new NotFoundException(`Shop #${id} cannot be found`)
        return shop
    }

    async update(id: number, updateShopDto: UpdateShopDto) {
        const shop = await this.shopRepository.preload({
            id,
            ...updateShopDto,
        })
        if (!shop)
            throw new NotFoundException(
                `Shop #${id} cannot be updated because it doesn't exist`
            )
        return this.shopRepository.save(shop)
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
