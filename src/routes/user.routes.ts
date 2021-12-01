import * as Router from 'koa-router'
import UserController from '../controllers/user.controller'
import adminMiddleware from '../middlewares/admin.middleware'
import authMiddleware from '../middlewares/auth.middleware'
require('dotenv').config()

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/users'
}
const userRouter: Router = new Router(routerOpts)
// /api/users/ get all users
userRouter.get('/', authMiddleware, adminMiddleware, UserController.getUsers)
// /api/users/refresh refreshes access token
userRouter.get('/refreshUser', UserController.refresh)
// /api/users/:user_id get one user
userRouter.get('/:user_id', authMiddleware, UserController.getUser)
// /api/users/register/token
userRouter.get('/register/:link', UserController.saveUser)
// /api/users/register register ner user
userRouter.post('/register', UserController.registerUser)
// /api/users/auth authentificate user
userRouter.post('/auth', UserController.login)
// /api/logout logout user (deletes refreshToken from db and cookie)
userRouter.post('/logout', authMiddleware, UserController.logout)
// /api/users/:user_id delete user from db
userRouter.delete('/:user_id', authMiddleware, adminMiddleware, UserController.deleteUser)
// /api/users/:user_id update user in db
userRouter.patch('/:user_id', authMiddleware, UserController.updateUser)

export default userRouter
