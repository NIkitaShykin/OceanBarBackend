import * as Koa from 'koa'
import * as JWT from 'jsonwebtoken'
import { hashSync } from 'bcrypt'
import User from '../models/user.entity'
require('dotenv').config()

export default async function(ctx: Koa.Context, next: Koa.Next) {
    try {
        const user: User = {
            name: ctx.request.body.name,
            secondname: ctx.request.body.secondname,
            email: ctx.request.body.email,
            password: hashSync(ctx.request.body.password, 10),
            phone: ctx.request.body.phone,
            city: '',
            flat: '',
            homeNumber: '',
            homePart: '',
            street: ""
        } 
        ctx.query.token = JWT.sign(
            user,
            process.env.JWT_SECRET, 
            {expiresIn: '10min'}
        )
        await next()
    } catch (error){
        ctx.body = {
            error: error,
            message: '1'
        }
    }
}
