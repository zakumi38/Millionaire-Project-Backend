import { Column, Entity, OneToMany, OneToOne } from "typeorm"
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

    @Column("int", { default: 0 })
    todayIncome: number

    @Column("json", { nullable: true })
    previousPayments: previousPayments[]

    @Column("varchar", { nullable: true })
    photoUrl: string

    @Column("varchar", { nullable: true })
    accessToken: string

    @Column("varchar", { nullable: true })
    refreshToken: string

    @OneToMany(() => Order, (order) => order.rider, { nullable: true })
    completedOrders: Order[]

    @OneToOne(() => Order, (order) => order.rider, { nullable: true })
    currentOrder: Order
}
