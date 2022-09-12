import { Order } from "../../orders/entities/order.entity"

interface Coordinate {
    latitude: string
    longitude: string
}

export class CreateCustomerDto {
    readonly name: string

    readonly phoneNumber: string

    readonly email?: string

    readonly location?: string

    readonly coordinate?: Coordinate

    readonly orders?: Order[]
}
