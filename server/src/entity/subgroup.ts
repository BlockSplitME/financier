import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm"

@Entity()
@Unique(["name", "isIncome"])
export class Subgroup {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false, default: false })
    isIncome: boolean

    @Column()
    description: string
}
