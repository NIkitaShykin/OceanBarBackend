import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
require('dotenv').config()

export default async function (ctx: Koa.Context, next: Koa.Next) {
    try {
        if (!ctx.params.isAdmin) ctx.throw(HttpStatus.FORBIDDEN, 'You have not enough permissions')
        await next()
    } catch(error) {
        ctx.body = {
            error: error
        }
    }
}
