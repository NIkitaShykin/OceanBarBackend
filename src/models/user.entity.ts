import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number

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
}