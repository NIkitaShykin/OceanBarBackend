import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Order from "./order.entity"
import CartPosition from "./cart.entity"

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({nullable: true})
    refreshToken?: string

    @Column({type:"boolean", nullable: true, default: false})
    isActivated?: boolean

    @Column({type:'boolean', nullable: true, default: false})
    isAdmin: true

    @Column({nullable: true})
    activationLink?: string

    @Column({nullable: false})
    name?: string

    @Column({nullable: false})
    secondname?: string

    @Column({unique: true ,nullable: false})
    email?: string

    @Column({nullable: false})
    password?: string

    @Column({nullable: false})
    phone?: string

    @Column({nullable: true})
    city?: string

    @Column({nullable: true})
    street?: string

    @Column({nullable: true})
    homeNumber?: string

    @Column({nullable: true})
    homePart?: string

    @Column({nullable: true})
    flat?: string
    
    @OneToMany(() => CartPosition, cart => cart.user, {cascade: true, onDelete: 'CASCADE'})
    cart?: CartPosition[]

    @OneToMany(() => Order, order => order.user, {cascade: true, onDelete: 'CASCADE'})
    orders?: Order[]
}
