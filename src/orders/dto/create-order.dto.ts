import { Customer } from "../../customers/entities/customer.entity"
import { Rider } from "../../riders/entities/rider.entity"

export class CreateOrderDto {
    readonly customer: Customer

    readonly rider?: Rider

    readonly orderedItems: number[]

    readonly destination: string

    readonly isCompleted?: boolean = false
}
