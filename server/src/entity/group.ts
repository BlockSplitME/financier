import {Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm"

@Entity()
@Unique(["name", "isIncome"])
export class Group {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false, default: false })
    isIncome: boolean

    @Column({nullable: true})
    description: string
}
