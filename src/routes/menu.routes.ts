import * as Router from 'koa-router'
import MenuController from '../controllers/menu.controller'
import adminMiddleware from '../middlewares/admin.middleware'
import authMiddleware from '../middlewares/auth.middleware'

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/menu'
}
const menuRouter: Router = new Router(routerOpts)
// /api/menu/ get all dishes
menuRouter.get('/', MenuController.getMenu)
// /api/menu/:dish_id get one dish
menuRouter.get('/:dish_id', MenuController.getDish)
// /api/menu/ create new dish
menuRouter.post('/', authMiddleware, adminMiddleware, MenuController.addDish)
// /api/menu/:dish_id delete dish from DB
menuRouter.delete('/:dish_id', authMiddleware, adminMiddleware, MenuController.deleteDish)
// /api/menu/:dish_id update dish in DB
menuRouter.patch('/:dish_id', authMiddleware, adminMiddleware, MenuController.updateDish);
// /api/menu/image upload image to S3
menuRouter.post('/image', authMiddleware, adminMiddleware, MenuController.uploadImage)

export default menuRouter;
