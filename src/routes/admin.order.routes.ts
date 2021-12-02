import * as Router from 'koa-router'
import authMiddleware from '../middlewares/auth.middleware'
import OrderController from '../controllers/order.conrtoller'
import adminMiddleware from '../middlewares/admin.middleware'

const routerOpts: Router.IRouterOptions = {
  prefix: '/api/admin/order'
}

const orderAdminRouter: Router = new Router(routerOpts)
orderAdminRouter.get('/', authMiddleware, adminMiddleware, OrderController.getAllOrders)

orderAdminRouter.patch('/:order_id', authMiddleware, adminMiddleware, OrderController.updateOrderAdmin)

orderAdminRouter.delete('/:order_id', authMiddleware, adminMiddleware, OrderController.deleteOrderAdmin)

export default orderAdminRouter