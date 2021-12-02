import * as Router from 'koa-router'
import BookingController from "../controllers/booking.controller";
import adminMiddleware from '../middlewares/admin.middleware';
import authMiddleware from '../middlewares/auth.middleware';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/booking'
}

const bookingRouter: Router = new Router(routerOpts)
// /api/cart/ get cart for user
bookingRouter.get('/', authMiddleware, adminMiddleware, BookingController.getBooking)
bookingRouter.get('/usersbooking', authMiddleware, adminMiddleware, BookingController.getUsersBooking)
bookingRouter.patch('/usersbooking', authMiddleware, adminMiddleware, BookingController.updateBooking)
bookingRouter.post('/', BookingController.createBooking)
bookingRouter.delete('/usersbooking', authMiddleware, adminMiddleware, BookingController.deleteUsersBooking)

export default bookingRouter
