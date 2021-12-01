import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export default class BookedUsersEntity {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({nullable: false})
    name: string

    @Column({nullable: false})
    phone: string

    @Column({nullable: false})
    date?: string

    @Column({nullable: false})
    time?: string

    @Column({nullable: false})
    amountofpeople?:  number
}
