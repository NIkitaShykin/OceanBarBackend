import * as Koa from 'koa'
import * as Router from 'koa-router'
import {getRepository, Repository} from 'typeorm'
import Dish from '../models/menu.entity'
// import Cart from '../models/cart.entity'
import * as HttpStatus from 'http-status-codes'
import {Like} from "typeorm";

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/cart',
    
}
const cartRouter: Router = new Router(routerOpts)

 cartRouter.get('/:user_id', async (ctx: Koa.Context) => {
   //for user with user_id get all dishes from cart_id  
   let user_id = ctx.params.user_id
   // response for test
   ctx.body = `send all dishes from cartId for userId=${user_id}` 
});

cartRouter.post('/addDish/:user_id', async (ctx: Koa.Context) => {  
    //for user with user_id add one dish_id to cart_id   
    let user_id = ctx.params.user_id
    let dish_id = ctx.request.body.dishId
    let ingredients = ctx.request.body.ingredients
    // response for test
    ctx.body = `add dish to cart for userId=${user_id} dishId=${dish_id} with ingredients=${ingredients}`  
});

cartRouter.patch('/updateDish/:user_id', async (ctx: Koa.Context) => {  
    //for user with user_id replace one dish_id in cart_id with new ingredients
    let user_id = ctx.params.user_id
    let dish_id = ctx.request.body.dishId
    let ingredients = ctx.request.body.ingredients
    // response for test
    ctx.body = `replace dish to cart for userId=${user_id} dishId=${dish_id} with ingredients=${ingredients}` 
       
    // const menuRepo: Repository<Dish> = getRepository(Dish)
    // const dish: Dish = await menuRepo.findOne(ctx.params.user_id)
    // let copyDish={...dish}
    // copyDish.ingredients = ingredients
    // await menuRepo.save(dish)
    // ctx.body =copyDish.ingredients
});




cartRouter.put('/deleteDish/:user_id', async (ctx: Koa.Context) => {  
    //for user with user_id delete one dish_id in cart_id 
    let user_id = ctx.params.user_id
    let dish_id = ctx.request.body.dishId
    // response for test
    ctx.body = `remove on dishId=${dish_id} from cart_id for userId=${user_id}` 
});
cartRouter.delete('/deleteAllDish/:user_id', async (ctx: Koa.Context) => {
    //for user with user_id delete all dish in cart_id 
    let user_id = ctx.params.user_id
    ctx.body =`cleare cartId for userId=${user_id}`
})


export default cartRouter;
