import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {Group} from "./group";
import {Subgroup} from "./subgroup";

@Entity()
export class Expenses {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    date: Date

    @Column({ nullable: false })
    name: string

    @ManyToOne(() => Group, group => group.name)
    group: Group;

    @ManyToOne(() => Subgroup, subgroup => subgroup.name)
    subgroup: Subgroup;

    @Column()
    description: string

    @Column({ nullable: false })
    sum: number
}
