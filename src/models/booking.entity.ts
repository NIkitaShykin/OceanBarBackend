import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity()
export default class Booking {

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    date?: string

    @Column()
    time?: string

    @Column({type: "int", default: 0})
    forTwoPersons?: number

    @Column({type: "int", default: 0})
    forFourPersons?: number

    @Column({type: "int", default: 0})
    forSixPersons?: number

    @Column({type: "int", default: 0})
    forEighthPersons?: number

    @Column({type: "int", default: 0})
    forTenPersons?: number
}
