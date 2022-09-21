import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator"
import { Order } from "../../orders/entities/order.entity"
interface previousPayment {
    date: string
    amount: number
}

export class CreateRiderDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly password: string

    @IsOptional()
    @IsEmail({ message: "Email is not in email format" })
    readonly email: string

    @IsNotEmpty()
    @IsString()
    readonly phoneNumber: string

    @IsOptional()
    @IsString()
    readonly accessToken: string

    @IsOptional()
    @IsString()
    readonly refreshToken: string

    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    readonly previousPayments?: previousPayment[]

    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    readonly completedOrders?: Order[]

    @IsOptional()
    readonly currentOrder?: Order
}
