import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator"

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
    @IsString()
    readonly destination: string

    @IsOptional()
    @IsBoolean({ each: true })
    readonly isCompleted?: boolean = false
}
