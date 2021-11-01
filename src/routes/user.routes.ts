import * as Koa from 'koa'
import * as Router from 'koa-router'
import {hashSync, compare} from 'bcrypt'
import {getRepository, Repository} from 'typeorm'
import User from '../models/user.entity'
import * as HttpStatus from 'http-status-codes'
import * as JWT from 'jsonwebtoken'

require('dotenv').config()
import mailer from "../controllers/mail.controller";
export type MessageType ={
    to:string,
    subject: string,
    html:string
}
const routerOpts: Router.IRouterOptions = {
    prefix: '/api/users'
}
export const userRouter: Router = new Router(routerOpts)
const CreateToken = (name: string, secondname: string, email: string, password: string, phone: string) => {
    let token = JWT.sign(
        {
            name,
            secondname,
            email,
            password,
            phone
        },
        process.env.JWT_SECRET,
        {expiresIn: '10min'}
    )
    return token
}
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
// /api/users/register/token
userRouter.get('/register/:token', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    console.log(ctx.res.statusCode)
    const user: any = JWT.verify(ctx.params.token, process.env.JWT_SECRET, function (err: any, decoded: any): any {
        return decoded
    });
    await userRepo.save(user)
    ctx.redirect('http://localhost:3000/login')

})
// /api/users/register register ner user
userRouter.post('/register', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const checkUser: User = await userRepo.findOne({email: ctx.request.body.email})
    if (checkUser) {
        ctx.throw(HttpStatus.BAD_REQUEST, 'User already exists')
    }
    ctx.request.body.password = hashSync(ctx.request.body.password, 10)
    const token = CreateToken(ctx.request.body.name, ctx.request.body.secondname, ctx.request.body.email, ctx.request.body.password, ctx.request.body.phone)
    const message : MessageType= {
        to: ctx.request.body.email,
        subject: 'Welcome to our site!',
        html: `<div>Поздравляем, Вы почти  зарегистрировались на нашем сайте! </div> 
            <div>Перейдите по ссылке для подтерждения аккаунта </div>
            <a href="http://localhost:3001/api/users/register/${token}"> Register me</a>`
    }
    mailer(message)
    ctx.body = {
        data: {
            email :ctx.request.body.email
        }
    }
})
// /api/users/auth authentificate user
userRouter.post('/auth', async (ctx: Koa.Context) => {
    const userRepo: Repository<User> = getRepository(User)
    const checkUser: User = await userRepo.findOne({
        email: ctx.request.body.email
    })
    if (!checkUser) {
        ctx.throw(HttpStatus.BAD_REQUEST, 'Username or password is incorrect')
    }
    const isMatch: boolean = await compare(ctx.request.body.password, checkUser.password)
    if (!isMatch) {
        ctx.throw(HttpStatus.BAD_REQUEST, 'Username or password is incorrect')
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


