import * as Koa from 'koa'
import {hashSync, compare} from 'bcrypt'
import {getRepository, Repository} from 'typeorm'
import User from '../models/user.entity'
import * as HttpStatus from 'http-status-codes'
import * as JWT from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import mailer from "../services/mail.service"
import generateTokens from '../services/tokens.service'
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
            data: users
        }
    }

    static async getUser(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const user: User = await userRepo.findOne(ctx.params.user_id)
        if (!user) ctx.throw(HttpStatus.NOT_FOUND)
        ctx.body = {
            data: user
        }
    }

    static async registerUser(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        const checkUser: User = await userRepo.findOne({email: ctx.request.body.email})
        if (checkUser) ctx.throw(HttpStatus.BAD_REQUEST, 'User already exists')
        ctx.request.body.password = hashSync(ctx.request.body.password, 10)
        ctx.request.body.activationLink = uuidv4()
        const newUser: User[] = userRepo.create(ctx.request.body)
        await userRepo.save(newUser)
        const message: MessageType= {
            to: ctx.request.body.email,
            subject: 'Welcome to our site!',
            html: `<div>Поздравляем, Вы почти  зарегистрировались на нашем сайте! </div> 
                <div>Перейдите по ссылке для подтерждения аккаунта </div>
                <a href=${ctx.URL.href}/${ctx.request.body.activationLink}> Register me</a>`
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

        if (!checkUser.isActivated) ctx.throw(HttpStatus.BAD_REQUEST, 'User is not activated')
        const tokens: {accessToken: string, refreshToken: string} = generateTokens({id: checkUser.id, isAdmin: checkUser.isAdmin})

        ctx.cookies.set('refreshToken',  tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        checkUser.refreshToken = tokens.refreshToken

        await userRepo.save(checkUser)

        ctx.body = {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            data: checkUser
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
        const updatedUser: User = userRepo.merge(user, ctx.request.body)
        if (ctx.request.body.password) updatedUser.password = hashSync(ctx.request.body.password, 10)
        await userRepo.save(updatedUser)

        ctx.body = {
            data: {user: updatedUser}
        }
    }

    static async saveUser(ctx: Koa.Context) {
        const userRepo: Repository<User> = getRepository(User)
        let newUser: User = await userRepo.findOne({
            where: {
                activationLink: ctx.params.link
            }
        })
        if (!newUser) ctx.throw(HttpStatus.NOT_FOUND, 'User not found')
        newUser.isActivated = true
        const tokens: {accessToken: string, refreshToken: string} = generateTokens({id: newUser.id, isAdmin: newUser.isAdmin})
        newUser.refreshToken = tokens.refreshToken
        ctx.cookies.set('refreshToken',  tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        await userRepo.save(newUser)
        ctx.redirect(`${process.env.CLIENT_URL}/login`)
        ctx.body = {
            data: newUser
        }
    }

    static async logout(ctx: Koa.Context){
        const userRepo: Repository<User> = getRepository(User)
        let user: User = await userRepo.findOne(ctx.params.user_id)
        if (!user) ctx.throw(HttpStatus.NOT_FOUND, "User not found")
        user.refreshToken = null
        ctx.cookies.set('refreshToken', null)
        await userRepo.save(user)
        ctx.redirect(`${process.env.CLIENT_URL}/login`)
        ctx.body = {
            data: user
        }
    }

    static async refresh(ctx: Koa.Context){
        const userRepo: Repository<User> = getRepository(User)
        const refreshToken: string = ctx.cookies.get('refreshToken')
        if (!refreshToken) ctx.throw(HttpStatus.UNAUTHORIZED, 'User not authorized')
        const userData: string | JWT.JwtPayload = JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user: User = await userRepo.findOne({where:{ refreshToken: refreshToken}})
        if (!userData || !user) ctx.throw(HttpStatus.UNAUTHORIZED, 'User not authorized')
        const tokens: {accessToken: string, refreshToken: string} = generateTokens({id: user.id, isAdmin: user.isAdmin})
        ctx.cookies.set('refreshToken',  tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        user.refreshToken = tokens.refreshToken

        await userRepo.save(user)
        ctx.body = {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            data: user
        }
    }
}
