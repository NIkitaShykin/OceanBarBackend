import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import CartPosition from "./cart.entity"

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
}
