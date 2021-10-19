import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export default class Dish {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true, nullable: false})
    name: string

    @Column({type: 'int', nullable: false})
    price: number
    
    @Column({nullable: false })
    weight: string

    @Column({nullable: false})
    calories: string

    @Column({nullable: false})
    image: string

    @Column({nullable: false})
    ingridients: string

    @Column({type: 'boolean', nullable: false})
    isSalad: boolean

    @Column({type: 'boolean', nullable: false})
    isPlato: boolean

    @Column({type: 'boolean', nullable: false})
    isSoup: boolean

    @Column({type: 'boolean', nullable: false})
    isOysters: boolean

    @Column({type: 'boolean', nullable: false})
    isDessert: boolean
}