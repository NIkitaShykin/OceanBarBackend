import * as Koa from 'koa'
import * as Router from 'koa-router'
import {hashSync, compare} from 'bcrypt'
import {getRepository, Repository} from 'typeorm'
import User from '../models/user.entity'
import * as HttpStatus from 'http-status-codes'
import * as JWT from 'jsonwebtoken'

require('dotenv').config()
import mailer from "../controllers/mail.controller";

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/users'
}
const userRouter: Router = new Router(routerOpts)
// /api/users/ get all users
userRouter.get('/', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const users: User[] = await userRepo.find()
    ctx.body = {
        data: {users}
    }
})
// /api/users/:user_id get one user
userRouter.get('/:user_id', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const user: User = await userRepo.findOne(ctx.params.user_id)
    if (!user) {
        ctx.throw(HttpStatus.NOT_FOUND)
    }
    ctx.body = {
        data: {user}
    }
})
// /api/users/register register ner user
userRouter.post('/register', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const checkUser: User = await userRepo.findOne({email: ctx.request.body.email})
    if (checkUser) {
        ctx.throw(HttpStatus.BAD_REQUEST, 'User already exists')
    }
    ctx.request.body.password = hashSync(ctx.request.body.password, 10)
    const user: User[] = userRepo.create(ctx.request.body)

    const message = {
        to: ctx.request.body.email,
        subject: 'Congratulations! You are successfully register on our site',
        text: `Поздравляем, Вы успешно зарегистрировались на нашем сайте!
        
        данные вашей учетной записи:
        login: ${ctx.request.body.email}
                
        Данное письмо не требует ответа.`
    }
    mailer(message)
    const token = JWT.sign(
        {
            name: ctx.request.body.name,
            secondname: ctx.request.body.secondname,
            email: ctx.request.body.email,
            password: ctx.request.body.password,
            phone: ctx.request.body.phone
        },
        process.env.JWT_SECRET,
        {expiresIn: '10min'}
    )
    // await userRepo.save(user)
    ctx.body = {
        token,
        data: {user}
    }
})
// /api/users/auth authentificate user
userRouter.post('/auth', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const checkUser: User = await userRepo.findOne({
        email: ctx.request.body.email
    })
    if (!checkUser) {
        ctx.throw(HttpStatus.BAD_REQUEST, 'Username or a is incorrect')
    }
    const isMatch: boolean = await compare(ctx.request.body.password, checkUser.password)
    if (!isMatch) {
        ctx.throw(HttpStatus.BAD_REQUEST, 'Username or word is incorrect')
    }
    const token = JWT.sign(
        {userId: checkUser.id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )

    ctx.body = {
        token,
        data: checkUser,
    }

})
// /api/users/:user_id delete user from db
userRouter.delete('/:user_id', async (ctx: Koa.Context) => {
    const menuRepo: Repository<User> = getRepository(User)
    const user: User = await menuRepo.findOne(ctx.params.user_id)
    if (!user) {
        ctx.throw(HttpStatus.NOT_FOUND)
    }
    await menuRepo.delete(user)

    ctx.body = {
        message: `User with id ${ctx.params.user_id} deleted`
    }
});
// /api/users/:user_id update user in db
userRouter.patch('/:user_id', async (ctx) => {
    const userRepo: Repository<User> = getRepository(User)
    const user: User = await userRepo.findOne(ctx.params.user_id)
    if (!user) {
        ctx.throw(HttpStatus.NOT_FOUND)
    }
    const updatedUser: User = await userRepo.merge(user, ctx.request.body)
    updatedUser.password = hashSync(updatedUser.password, 10)
    userRepo.save(updatedUser)

    ctx.body = {
        data: {user: updatedUser}
    }
})


export default userRouter
