import * as Koa from 'koa'
import * as JWT from 'jsonwebtoken'
import * as HttpStatus from 'http-status-codes'
import User from '../models/user.entity'
import {getRepository, Repository} from 'typeorm'
import { StatusCodes } from 'http-status-codes'
require('dotenv').config()

export default async function (ctx: Koa.Context, next: Koa.Next) {
    try {
        if (!ctx.req.headers.authorization) ctx.throw(StatusCodes.UNAUTHORIZED, 'You are not authorized')
        const token: string  = ctx.req.headers.authorization.split(' ')[1]
        if (!token) ctx.throw(StatusCodes.UNAUTHORIZED, 'You are not authorized')
        const user: any = JWT.verify(token, process.env.JWT_SECRET)
        if (!user) ctx.throw(StatusCodes.UNAUTHORIZED, 'Your token expired')
        const userRepo: Repository<User> = getRepository(User)
        const checkUser = await userRepo.findOne(user.id)
        if(!checkUser) ctx.throw(StatusCodes.NOT_FOUND, 'User not found')
        if(!checkUser.isActivated) ctx.throw(StatusCodes.BAD_REQUEST, 'User is not activated')
        ctx.params.user_id = user.id
        ctx.params.isAdmin = user.isAdmin
        await next()
    } catch(error) {
        ctx.body = {
            error: error
        }
        if (error.name === 'TokenExpiredError') {
            ctx.status = StatusCodes.UNAUTHORIZED
        } else {
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR
        }
    }
}
