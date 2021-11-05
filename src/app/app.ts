import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import * as bodyparser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import menuRouter from '../routes/menu.routes'
import userRouter from '../routes/user.routes'
import cartRouter from '../routes/cart.routes'

const app: Koa = new Koa()
app.use(cors())
app.use(bodyparser())
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(menuRouter.routes()).use(menuRouter.allowedMethods())
app.use(cartRouter.routes()).use(cartRouter.allowedMethods())

app.use(async (ctx: Koa.Context, next: () => Promise<any>)=>{
    try {
        await next()
    } catch (error) {
        ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR
        error.status = ctx.status
        ctx.body = { error }
        ctx.app.emit('error', error, ctx)
    }
})

app.on('error',console.error);

export default app
