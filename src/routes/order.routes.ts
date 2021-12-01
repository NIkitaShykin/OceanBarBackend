import * as Router from 'koa-router'
import authMiddleware from '../middlewares/auth.middleware'
import OrderController from '../controllers/order.conrtoller'
import adminMiddleware from '../middlewares/admin.middleware'

const routerOpts: Router.IRouterOptions = {
  prefix: '/api/order'
}

const orderRouter: Router = new Router(routerOpts)
// /api/order/ create order for user
orderRouter.post('/', authMiddleware, OrderController.addOrder)

// /api/order/ get orders for user
orderRouter.get('/', authMiddleware, OrderController.getOrders)
orderRouter.get('/orders', OrderController.getAllOrders)
orderRouter.patch('/orders', OrderController.updateOrder)
orderRouter.get('/takeaway', authMiddleware, OrderController.getTimeForTakeaway)

// /api/order/ get order by ID for user
orderRouter.get('/:order_id', authMiddleware, OrderController.getOrderById)

// /api/order/ update order state by ID for user
orderRouter.patch('/:order_id', authMiddleware, OrderController.updateOrder)

/* // api/order/:order_id delete order from DB
orderRouter.delete('/:order_id', authMiddleware, OrderController.deleteOrder)
 */

export default orderRouter
