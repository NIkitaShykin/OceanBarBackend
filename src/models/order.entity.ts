import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import Dish from "./menu.entity"
import User from "./user.entity"

@Entity()
export default class Order {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({nullable: true, default: 0})
    price?: number

    @Column({nullable: true})
    state?: string

    @ManyToOne(() => User, user => user.orders)
    user?: User

    @OneToMany(() => Dish, dish => dish.order)
    dishes?: Dish[]
}
