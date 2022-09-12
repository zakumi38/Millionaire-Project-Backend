import { Order } from "../../orders/entities/order.entity"

interface Coordinate {
    latitude: string
    longitude: string
}

export class CreateCustomerDto {
    name: string

    phoneNumber: string

    email?: string

    location?: string

    coordinate?: Coordinate

    orders?: Order[]
}
