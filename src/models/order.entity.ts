import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import Dish from "./menu.entity"
import User from "./user.entity"

type orderState = 'В процессе' | 'Выполнен'
type orderType = 'Бронирование стола' | 'Доставка' | 'Навынос'

@Entity()
export default class Order {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({nullable: true})
    price?: number

    @Column({nullable: true})
    state?: string
    // state?: orderState

    @ManyToOne(() => User, user => user.orders)
    user?: User

    @OneToMany(() => Dish, dish => dish.order)
    dishes?: Dish[]

    @Column({nullable: true})
    type?: string
    // type?: orderType

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
