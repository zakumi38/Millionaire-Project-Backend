import { Column, Entity } from "typeorm";

@Entity()
export class Shop {
    @Column("varchar")
    name: string;

    @Column("varchar")
    location: string;

    @Column("varchar")
    latitudeLongitude: string;
}
