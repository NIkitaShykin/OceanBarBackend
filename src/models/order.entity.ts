import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import CartPosition from "./cart.entity"
import User from "./user.entity"

@Entity()
export default class Order {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    price?: number

    @Column()
    state?: string

    @ManyToOne(() => User, user => user.orders)
    user?: User

    @OneToMany(() => CartPosition, cart => cart.order)
    cartPositions?: CartPosition[]
}
