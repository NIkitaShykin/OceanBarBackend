import * as Koa from 'koa'
import {hashSync, compare} from 'bcrypt'
import {getRepository, Repository} from 'typeorm'
import User from '../models/user.entity'
import * as HttpStatus from 'http-status-codes'
import * as JWT from 'jsonwebtoken'
import mailer from "../controllers/mail.controller";
require('dotenv').config()

export type MessageType ={
    to:string,
    subject: string,
    html:string
}

export default class UserController {

    static async getUsers(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const users: User[] = await userRepo.find()
        ctx.body = {
            data: {users}
        }
    }

    static async getUser(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const user: User = await userRepo.findOne(ctx.params.user_id)
        if (!user) ctx.throw(HttpStatus.NOT_FOUND)
        ctx.body = {
            data: {user}
        }
    }

    static async registerUser(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const checkUser: User = await userRepo.findOne({email: ctx.request.body.email})
        if (checkUser) ctx.throw(HttpStatus.BAD_REQUEST, 'User already exists')

        ctx.request.body.password = hashSync(ctx.request.body.password, 10)
        const token: string | string[] = ctx.query.token
        const message: MessageType= {
            to: ctx.request.body.email,
            subject: 'Welcome to our site!',
            html: `<div>Поздравляем, Вы почти  зарегистрировались на нашем сайте! </div> 
                <div>Перейдите по ссылке для подтерждения аккаунта </div>
                <a href="${ctx.URL.href}/${token}"> Register me</a>`
        }
        mailer(message)
        ctx.body = {
            data: {
                email :ctx.request.body.email,
            }
        }
    }

    static async login(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const checkUser: User = await userRepo.findOne({
            email: ctx.request.body.email
        })
        if (!checkUser) ctx.throw(HttpStatus.BAD_REQUEST, 'Username or password is incorrect')
        const isMatch: boolean = await compare(ctx.request.body.password, checkUser.password)
        if (!isMatch) ctx.throw(HttpStatus.BAD_REQUEST, 'Username or password is incorrect')

        const token = JWT.sign(
            {userId: checkUser.id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )
    
        ctx.body = {
            token,
            data: checkUser,
        }
    
    }

    static async deleteUser(ctx: Koa.Context) {
        const menuRepo: Repository<User> = getRepository(User)
        const user: User = await menuRepo.findOne(ctx.params.user_id)
        if (!user) ctx.throw(HttpStatus.NOT_FOUND)
        await menuRepo.delete(user)
    
        ctx.body = {
            message: `User with id ${ctx.params.user_id} deleted`
        }
    }

    static async updateUser(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const user: User = await userRepo.findOne(ctx.params.user_id)
        if (!user) ctx.throw(HttpStatus.NOT_FOUND)
        if (!ctx.request.body.city) ctx.request.body.city = 'г. Минск'
        const updatedUser: User = await userRepo.merge(user, ctx.request.body)
        updatedUser.password = hashSync(updatedUser.password, 10)
        userRepo.save(updatedUser)
    
        ctx.body = {
            data: {user: updatedUser}
        }
    }

    static async saveUser(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const user: any = JWT.verify(ctx.params.token, process.env.JWT_SECRET, function (err: any, decoded: User): User {
            return decoded
        });
        await userRepo.save(user)
        ctx.body = {
            data: user
        }
    }

}
