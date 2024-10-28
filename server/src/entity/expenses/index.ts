import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Expenses {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    date: Date

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    group: string

    @Column()
    subgroup: string

    @Column()
    description: string

    @Column({ nullable: false })
    sum: number
}
