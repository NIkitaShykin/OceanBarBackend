import * as Router from 'koa-router'
import registerMiddleware from '../middlewares/register.middleware'
import UserController from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'
require('dotenv').config()

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/users'
}
const userRouter: Router = new Router(routerOpts)
// /api/users/ get all users
userRouter.get('/', authMiddleware ,UserController.getUsers)
// /api/users/:user_id get one user
userRouter.get('/:user_id', authMiddleware, UserController.getUser)
// /api/users/register/token
userRouter.post('/register/:token', UserController.saveUser)
// /api/users/register register ner user
userRouter.post('/register', registerMiddleware, UserController.registerUser)
// /api/users/auth authentificate user
userRouter.post('/auth', UserController.login)
// /api/users/:user_id delete user from db
userRouter.delete('/:user_id', authMiddleware, UserController.deleteUser)
// /api/users/:user_id update user in db
userRouter.patch('/:user_id', authMiddleware, UserController.updateUser)

export default userRouter
