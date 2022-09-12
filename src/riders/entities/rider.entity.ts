import { Column, Entity } from "typeorm"
import { Common } from "../../common/entities/common.entity"

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

    @Column("json", { nullable: true })
    previousPayments: previousPayments[]

    @Column("varchar", { nullable: true })
    photoUrl: string
}
