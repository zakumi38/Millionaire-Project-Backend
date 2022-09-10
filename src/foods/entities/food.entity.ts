import { Column, Entity } from "typeorm";
import { Common } from "../../common/entities/common.entity";

@Entity()
export class Food extends Common {
    @Column("varchar")
    name: string;

    @Column("int")
    price: number;

    @Column("text", { nullable: true })
    description: string;

    @Column("boolean", { nullable: true })
    isAvailable: boolean;
}
