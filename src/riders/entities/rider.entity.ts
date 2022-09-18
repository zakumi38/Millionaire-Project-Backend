import { Column, Entity, OneToMany } from "typeorm"
import { Common } from "../../common/entities/common.entity"
import { Order } from "../../orders/entities/order.entity"

interface previousPayments {
    date: string
    amount: number
}

@Entity()
export class Rider extends Common {
    @Column("varchar", { unique: true })
    name: string

    @Column("varchar", { nullable: true, unique: true })
    email: string

    @Column("varchar", { unique: true })
    phoneNumber: string

    @Column("varchar")
    password: string

    @Column("json", { nullable: true })
    previousPayments: previousPayments[]

    @Column("varchar", { nullable: true })
    photoUrl: string

    @OneToMany(() => Order, (order) => order.rider)
    orders: Order[]
}
