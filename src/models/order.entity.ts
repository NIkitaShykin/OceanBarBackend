import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Tree } from "typeorm"
import Dish from "./menu.entity"
import OrderDish from "./orderDish.entity"
import User from "./user.entity"

type orderState = 'В процессе' | 'Выполнен'
type orderType = 'Бронирование стола' | 'Доставка' | 'Навынос'

@Entity()
export default class Order {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({nullable: true, default: 0})
    price?: number

    @Column({nullable: true})
    state?: orderState

    @ManyToOne(() => User, user => user.orders)
    user?: User

    @OneToMany(()=> OrderDish, dish => dish.order)
    dishes?: OrderDish[]

    @Column({nullable: true})
    type?: orderType

    @Column({nullable: true})
    date?: string

    @Column({nullable: true})
    time?: string

    @Column({nullable: true})
    tableSize?: string

    @Column({nullable: true})
    paymentType?: string

    @Column({nullable: true})
    address?: string
}
