import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import Dish from "./menu.entity"
import Order from "./order.entity"


@Entity()
export default class OrderDish {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    ingredients: string

    @Column()
    quantity: number

    @ManyToOne(()=> Order, order => order.dishes, {cascade: true, onDelete: 'CASCADE'})
    order?:Order

    @ManyToOne(()=> Dish, dish => dish.order)
    dish: Dish
}
