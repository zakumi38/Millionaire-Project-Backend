import { Common } from "src/common/entities/common.entity"
import { Customer } from "src/customers/entities/customer.entity"
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm"
import { Rider } from "../../riders/entities/rider.entity"
import { Food } from "../../foods/entities/food.entity"

@Entity()
export class Order extends Common {
    @ManyToOne(() => Customer, (customer) => customer.orders)
    customer: Customer

    @ManyToOne(() => Rider, (rider) => rider.orders, { nullable: true })
    rider: Rider

    @ManyToMany(() => Food)
    @JoinTable()
    orderedItems: Food[]

    @Column("varchar")
    destination: string

    @Column("boolean", { default: false, nullable: true })
    isCompleted: boolean
}
