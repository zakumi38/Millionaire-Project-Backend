import { Common } from "src/common/entities/common.entity"
import { Order } from "src/orders/entities/order.entity"
import { Column, Entity, OneToMany } from "typeorm"

interface Coordinate {
    latitude: string
    longitude: string
}

@Entity()
export class Customer extends Common {
    @Column("varchar")
    name: string

    @Column("varchar", { unique: true })
    phoneNumber: string

    @Column("varchar", { nullable: true, unique: true })
    email: string

    @Column("varchar", { nullable: true })
    location: string

    @Column("json", { nullable: true })
    coordinate: Coordinate

    @Column("varchar")
    password: string

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[]
}
