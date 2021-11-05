import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Order from "./order.entity"
import CartPosition from "./cart.entity"

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

    @Column()
    city?: string

    @Column()
    street?: string

    @Column()
    homeNumber?: string

    @Column()
    homePart?: string

    @Column()
    flat?: string
    
    @OneToMany(() => CartPosition, cart => cart.user)
    cart?: CartPosition[]

    @OneToMany(() => Order, order => order.user)
    orders?: Order[]
}
