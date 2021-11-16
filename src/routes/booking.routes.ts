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

export default bookingRouter
