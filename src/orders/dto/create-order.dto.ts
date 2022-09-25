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
    @IsObject({ each: true })
    readonly orderedItems: Quantity[]

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
