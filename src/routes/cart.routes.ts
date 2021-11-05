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
cartRouter.delete('/:pos_id', authMiddleware, CartController.deleteDishFromCard)
// /api/cart/ delete full cart and order for user
cartRouter.delete('/', authMiddleware, CartController.deleteCart)
// /api/cart/:pos_id updates chosen position
cartRouter.patch('/:pos_id', authMiddleware, CartController.updatePosition)

export default cartRouter
