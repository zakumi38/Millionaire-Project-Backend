import { Order } from "../../orders/entities/order.entity"
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"

class Coordinate {
    latitude: string
    longitude: string
}

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly phoneNumber: string

    @IsNotEmpty()
    @IsString()
    readonly password: string

    @IsOptional()
    @IsEmail({ message: "Email is not in email format" })
    readonly email: string

    @IsOptional()
    @IsString()
    readonly location: string

    // TODO: ValidateNested Not Working for this one
    @IsOptional()
    @ValidateNested({
        each: true,
        message: "Wrong Latitude and Longitude format",
    })
    @Type(() => Coordinate)
    readonly coordinate?: Coordinate

    @IsOptional()
    @ValidateNested({ each: true, message: "Error in orders of customer" })
    @Type(() => Order)
    readonly orders?: Order[]
}
