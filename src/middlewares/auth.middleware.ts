import * as Koa from 'koa'
import * as JWT from 'jsonwebtoken'
import * as HttpStatus from 'http-status-codes'
import User from '../models/user.entity'
import {getRepository, Repository} from 'typeorm'
require('dotenv').config()

export default async function (ctx: Koa.Context, next: Koa.Next) {
    try {
        if (!ctx.req.headers.authorization) ctx.throw(HttpStatus.UNAUTHORIZED, 'You are not authorized')
        const token: string  = ctx.req.headers.authorization.split(' ')[1]
        if (!token) ctx.throw(HttpStatus.UNAUTHORIZED, 'You are not authorized')
        const user: any = JWT.verify(token, process.env.JWT_SECRET)
        if (!user) ctx.throw(HttpStatus.UNAUTHORIZED, 'Your token expired')
        const userRepo: Repository<User> = getRepository(User)
        const checkUser = await userRepo.findOne(user.id)
        if(!checkUser) ctx.throw(HttpStatus.NOT_FOUND, 'User not found')
        if(!checkUser.isActivated) ctx.throw(HttpStatus.BAD_REQUEST, 'User is not activated')
        ctx.params.user_id = user.id
        await next()
    } catch(error) {
        ctx.body = {
            error: error
        }
    }
}
