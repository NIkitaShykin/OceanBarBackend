import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import CartPosition from "./cart.entity"
import Order from "./order.entity"
import OrderDish from "./orderDish.entity"

type dishCategory = 'Плато' | 'Супы' | 'Салаты' | 'Запеченные устрицы' | 'Десерты'

@Entity()
export default class Dish {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({unique: true, nullable: false})
    name: string

    @Column({type: 'int', nullable: false})
    price: number

    @Column({nullable: false })
    weight: string

    @Column({nullable: false})
    calories: string

    @Column({nullable: false})
    imageURL: string

    @Column({nullable: false})
    ingredients: string

    @Column({nullable: false})
    dishCategory: dishCategory

    @OneToMany(() => CartPosition, cart => cart.dish)
    cartPositions?: CartPosition[]

    @OneToMany(() => OrderDish, order => order.dish, {cascade: true, onDelete: 'SET NULL'})
    order: OrderDish[]
}
