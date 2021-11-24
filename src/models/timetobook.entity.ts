import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity()
export default class TimeToBookEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    avalibletime?: string

}

