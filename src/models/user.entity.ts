import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Order from "./order.entity"

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({nullable: false})
    name: string

    @Column({nullable: false})
    secondname: string

    @Column({unique: true ,nullable: false})
    email: string

    @Column({nullable: false})
    password: string

    @Column({nullable: false})
    phone: string

    @OneToMany(() => Order, order => order.user)
    orders?: Order[]
}
