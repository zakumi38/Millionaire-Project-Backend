import { Common } from "src/common/entities/common.entity"
import { Customer } from "src/customers/entities/customer.entity"
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
} from "typeorm"
import { Rider } from "../../riders/entities/rider.entity"
import { Food } from "../../foods/entities/food.entity"

@Entity()
export class Order extends Common {
    @ManyToOne(() => Customer, (customer) => customer.orders)
    customer: Customer

    @ManyToOne(() => Rider, (rider) => rider.completedOrders, {
        nullable: true,
    })
    rider: Rider

    @OneToOne(() => Order, (order) => order.currentOrder, { nullable: true })
    currentOrder: Order

    @ManyToMany(() => Food)
    @JoinTable()
    orderedItems: Food[]

    @Column("varchar")
    destination: string

    @Column("float", { nullable: true })
    deliveryPercentage: number

    @Column("boolean", { default: false, nullable: true })
    isCompleted: boolean

    @Column("boolean", { default: false, nullable: true })
    isCanceled: boolean
}
