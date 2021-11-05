import * as Koa from 'koa'
import * as JWT from 'jsonwebtoken'
require('dotenv').config()

export default async function (ctx: Koa.Context, next: Koa.Next) {
    try {
        const token: string  = ctx.req.headers.authorization.split(' ')[1]
        if (!token) {
            ctx.body = {
                status: '403',
                message: 'Пользователь не авторизован'
            }
        }
        const user: any = JWT.verify(token, process.env.JWT_SECRET, function (err: any, decoded: any): any {
            return decoded
        });
        ctx.params.user_id = user.userId
    } catch(error) {
        ctx.body = {
            status: '403',
            message: 'Пользователь не авторизован',
            error: error
        }
    }
    await next()
}