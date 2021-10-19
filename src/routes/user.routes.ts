import * as Koa from 'koa'
import * as Router from 'koa-router'
import { hashSync, genSaltSync } from 'bcrypt'
import { getRepository, Repository } from 'typeorm'
import User from '../models/user.entity'
import * as HttpStatus from 'http-status-codes'

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/users'
}
const userRouter: Router = new Router(routerOpts)

userRouter.get('/', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const users: User[] = await userRepo.find()
    ctx.body = {
        data: { users }
    }
})

userRouter.post('/', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const checkUser: User = await userRepo.findOne({email: ctx.request.body.email})
    console.log(checkUser)
    if (checkUser){
        ctx.throw(HttpStatus.BAD_REQUEST, 'User already exists')
    }

    ctx.request.body.password = hashSync(ctx.request.body.password , 10)
    
    const user: User[] = userRepo.create(ctx.request.body)

    await userRepo.save(user)
    ctx.body = {
        data: { user }
    }
})

userRouter.delete('/:user_id', async (ctx:Koa.Context) => {
    const menuRepo: Repository<User> = getRepository(User)
    const dish: User = await menuRepo.findOne(ctx.params.dish_id)
    if(!dish){
        ctx.throw(HttpStatus.NOT_FOUND)
    }
    await menuRepo.delete(dish)

    ctx.body = {
        message: `User with id ${ctx.params.user_id} deleted`
    }
});


export default userRouter
