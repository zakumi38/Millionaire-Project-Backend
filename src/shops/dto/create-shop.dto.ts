import { Food } from "../../foods/entities/food.entity"

export class CreateShopDto {
    readonly name: string

    readonly location: string

    readonly latitudeLongitude: string

    readonly foods: Food[]
}
