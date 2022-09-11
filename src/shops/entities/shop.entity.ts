import { Column, Entity } from "typeorm"
import { Common } from "../../common/entities/common.entity"

@Entity()
export class Shop extends Common {
    @Column("varchar")
    name: string

    @Column("varchar")
    location: string

    @Column("varchar", { nullable: true })
    latitudeLongitude: string
}
