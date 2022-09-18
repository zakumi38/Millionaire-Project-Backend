import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Common {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdDate: Date
}