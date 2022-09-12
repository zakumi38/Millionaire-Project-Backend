import { Column, Entity, OneToMany } from "typeorm"
import { Common } from "../../common/entities/common.entity"
import { Food } from "../../foods/entities/food.entity"

@Entity()
export class Shop extends Common {
    @Column("varchar")
    name: string

 ;   @Column("varchar")
    location: string

 ;   @Column("varchar", { nullable: true })
    latitudeLongitude: string

 ;   @OneToMany(() => Food, (food) => food.shop, { cascade: true })
    foods: Food[]
}
