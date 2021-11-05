import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import Dish from "./menu.entity"
import Order from "./order.entity"
import User from "./user.entity"

@Entity()
export default class CartPosition {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ingredients: string

    @Column()
    quantity: number

    @ManyToOne(()=> Order, order => order.cartPositions)
    order?: Order

    @ManyToOne(()=> Dish, dish => dish.cartPositions)
    dish?: Dish

    @ManyToOne(()=> User, user => user.cart)
    user?: User
}
