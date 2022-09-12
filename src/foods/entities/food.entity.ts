import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { Common } from "../../common/entities/common.entity"
import { Shop } from "../../shops/entities/shop.entity"

@Entity()
export class Food extends Common {
    @Column("varchar")
    name: string

    @Column("int")
    price: number

    @Column("text", { nullable: true })
    description: string

    @Column("boolean", { nullable: true })
    isAvailable: boolean

    @ManyToOne(() => Shop, (shop) => shop.foods)
    @JoinColumn({ name: "shop_id" })
    shop: Shop
}
