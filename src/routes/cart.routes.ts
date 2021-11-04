import * as Router from 'koa-router'
import authMiddleware from '../middlewares/auth.middleware'
import CartController from '../controllers/cart.controller'

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/cart'
}

const cartRouter: Router = new Router(routerOpts)
// /api/cart/ get cart for user
cartRouter.get('/', authMiddleware, CartController.getCart)
// /api/cart/ add dish to the cart (also creates new order if needed)
cartRouter.post('/', authMiddleware, CartController.addDishToCart)
// /api/cart/:pos_id delete position from cart, if it's last position also deletes order
cartRouter.delete('/:pos_id', authMiddleware, CartController.DeleteDishFromCard)
// /api/cart/ delete full cart and order for user
cartRouter.delete('/', authMiddleware, CartController.DeleteCart)
// /api/cart/:pos_id updatesChoosed position
cartRouter.patch('/:pos_id', authMiddleware, CartController.UpdatePosition)
// /api/cart/sendOrder need to implement, endoint so set next status of order
cartRouter.post('/sendOrder', authMiddleware)

export default cartRouter
