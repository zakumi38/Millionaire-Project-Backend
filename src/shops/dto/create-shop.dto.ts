import { Food } from "../../foods/entities/food.entity"
import {
    IsNotEmpty, IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator"
import { Type } from "class-transformer"

export class CreateShopDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly location: string

    @IsNotEmpty()
    @IsString()
    readonly latitudeLongitude: string

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @Type(() => Food)
    readonly foods: Food[]
}
