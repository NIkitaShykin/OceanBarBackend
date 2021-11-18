import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity()
export default class Tables {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column({type: "int", default: 0})
    maxamount: number
}

