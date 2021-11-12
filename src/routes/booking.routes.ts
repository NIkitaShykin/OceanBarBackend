import * as Router from 'koa-router'
import BookingController from "../controllers/booking.controller";

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/booking'
}

const bookingRouter: Router = new Router(routerOpts)
// /api/cart/ get cart for user
bookingRouter.get('/', /*authMiddleware*/ BookingController.getBooking)
// /api/cart/ add dish to the cart (also creates new order if needed)
bookingRouter.post('/', /*authMiddleware*/ BookingController.createBooking)
// // /api/cart/:pos_id delete position from cart, if it's last position also deletes order
// bookingRouter.delete('/:', /*authMiddleware*/ BookingController.deleteBooking),
// // /api/cart/ delete full cart and order for user
// cartRouter.delete('/', authMiddleware, CartController.deleteCart)
// // /api/cart/:pos_id updates chosen position
// cartRouter.patch('/:pos_id', authMiddleware, CartController.updatePosition)

export default bookingRouter
