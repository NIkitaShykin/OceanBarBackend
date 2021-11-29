import * as Router from 'koa-router'
import BookingController from "../controllers/booking.controller";

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/booking'
}

const bookingRouter: Router = new Router(routerOpts)
// /api/cart/ get cart for user
bookingRouter.get('/', /*authMiddleware*/ BookingController.getBooking)
bookingRouter.get('/usersbooking', /*authMiddleware*/ BookingController.getUsersBooking)
bookingRouter.patch('/usersbooking', /*authMiddleware*/ BookingController.updateBooking)
bookingRouter.post('/', /*authMiddleware*/ BookingController.createBooking)

export default bookingRouter
