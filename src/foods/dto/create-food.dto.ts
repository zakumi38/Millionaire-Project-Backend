import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateFoodDto {
    @IsNotEmpty()
    @IsString({ message: "Price must be a string" })
    readonly name: string

    @IsNotEmpty()
    @IsNumber({}, { message: "Price must be a number" })
    readonly price: number

    @IsNotEmpty()
    @IsString({ message: "Description must be a string" })
    readonly description: string

    @IsNotEmpty()
    @IsBoolean()
    readonly isAvailable: boolean

    @IsNotEmpty()
    @IsNumber()
    readonly shop: number
}
