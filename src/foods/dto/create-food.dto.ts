import { Shop } from "../../shops/entities/shop.entity"

export class CreateFoodDto {
    readonly name: string

    readonly price: number

    readonly description: string

    readonly isAvailable: boolean

    readonly shop: Shop
}
