import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import * as bodyparser from 'koa-body'
import * as cors from '@koa/cors'
import menuRouter from '../routes/menu.routes'
import userRouter from '../routes/user.routes'
import cartRouter from '../routes/cart.routes'
import bookingRouter from '../routes/booking.routes'
import orderRouter from '../routes/order.routes'
import orderAdminRouter from '../routes/admin.order.routes'
require('dotenv').config()


const app: Koa = new Koa()
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(bodyparser({
    multipart: true,
}))
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(menuRouter.routes()).use(menuRouter.allowedMethods())
app.use(cartRouter.routes()).use(cartRouter.allowedMethods())
app.use(orderRouter.routes()).use(orderRouter.allowedMethods())
app.use(bookingRouter.routes()).use(bookingRouter.allowedMethods())
app.use(orderAdminRouter.routes()).use(orderAdminRouter.allowedMethods())

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
