import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity()
export default class Tables {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column()
    maxamount: number
}

