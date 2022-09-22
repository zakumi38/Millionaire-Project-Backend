import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator"
import { Quantity } from "../entities/order.entity"

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    readonly customer: number

    @IsOptional()
    @IsNumber()
    readonly rider?: number

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    readonly orderedItems: number[]

    @IsNotEmpty()
    @IsObject({ each: true })
    readonly quantities: Quantity[]

    @IsNotEmpty()
    @IsString()
    readonly destination: string

    @IsOptional()
    @IsBoolean({ each: true })
    readonly isCompleted?: boolean = false

    @IsOptional()
    @IsBoolean()
    readonly isCanceled?: boolean = false
}
