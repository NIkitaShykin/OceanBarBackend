import * as Koa from 'koa'
import * as Router from 'koa-router'
import {getRepository, Repository} from 'typeorm'
import Dish from '../models/menu.entity'
import * as HttpStatus from 'http-status-codes'
import {Like} from "typeorm";
import {dishCategory} from "../models/menu.entity";

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/menu'
}
const menuRouter: Router = new Router(routerOpts)
// /api/menu/ get all dishes
menuRouter.get('/', async (ctx: Koa.Context) => {
    const menuRepo: Repository<Dish> = getRepository(Dish)
    const DishName = ctx.request.query.name
    const CategoryName = ctx.request.query.category
    if (ctx.request.query.name) {
        const dishes: Dish[] = await menuRepo.find(
            {
                name: Like(`%${(DishName as string).toUpperCase()}%`)
            }
        )
        ctx.body = {
            data: {dishes}
        }
    } else if (ctx.request.query.category) {
        const dishes: Dish[] = await menuRepo.find(
            {   where:{
                    dishCategory: (CategoryName as string).charAt(0).toUpperCase() + (CategoryName as string).slice(1).toLowerCase()
                }
            }
        )
        ctx.body = {
            data: {dishes}
        }
    }
    else {
        const dishes: Dish[] = await menuRepo.find()
        ctx.body = {
            data: {dishes}
        }
    }


});
// /api/menu/:dish_id get one dish
menuRouter.get('/:dish_id', async (ctx: Koa.Context) => {
    const menuRepo: Repository<Dish> = getRepository(Dish)
    const dish: Dish = await menuRepo.findOne(ctx.params.dish_id)
    if (!dish) {
        ctx.throw(HttpStatus.NOT_FOUND)
    }
    ctx.body = {
        data: {dish}
    }
});
// /api/menu/ create new dish
menuRouter.post('/', async (ctx: Koa.Context) => {
    const menuRepo: Repository<Dish> = getRepository(Dish)
    const dish: Dish[] = menuRepo.create(ctx.request.body)
    await menuRepo.save(dish)
    ctx.body = {
        data: {dish}
    }
})
// /api/menu/:dish_id delete dish from DB
menuRouter.delete('/:dish_id', async (ctx: Koa.Context) => {
    const menuRepo: Repository<Dish> = getRepository(Dish)
    const dish: Dish = await menuRepo.findOne(ctx.params.dish_id)
    if (!dish) {
        ctx.throw(HttpStatus.NOT_FOUND)
    }
    await menuRepo.delete(dish)

    ctx.status = HttpStatus.NO_CONTENT
});
// /api/menu/:dish_id update dish in DB
menuRouter.patch('/:dish_id', async (ctx: Koa.Context) => {
    const menuRepo: Repository<Dish> = getRepository(Dish)
    const dish: Dish = await menuRepo.findOne(ctx.params.dish_id)
    if (!dish) {
        ctx.throw(HttpStatus.NOT_FOUND)
    }

    const updatedDish: Dish = await menuRepo.merge(dish, ctx.request.body)

    menuRepo.save(updatedDish)

    ctx.body = {
        data: {dish: updatedDish}
    }
});

export default menuRouter;
