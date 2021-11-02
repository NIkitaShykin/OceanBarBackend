import * as Koa from 'koa'
import {getRepository, Repository} from 'typeorm'
import Dish from '../models/menu.entity'
import * as HttpStatus from 'http-status-codes'
import {Like} from "typeorm";

export default class MenuController {

    static async getMenu(ctx: Koa.Context): Promise<void> {
        const menuRepo: Repository<Dish> = getRepository(Dish)
        const DishName = ctx.request.query.name
        const CategoryName = ctx.request.query.category
        let dishes: Dish[]
        if (ctx.request.query.name) {
            dishes = await menuRepo.find(
                {
                    name: Like(`%${(DishName as string).toUpperCase()}%`)
                }
            )
        } else if (ctx.request.query.category) {
            dishes = await menuRepo.find(
                {
                    where: {
                        dishCategory: (CategoryName as string).charAt(0).toUpperCase() + (CategoryName as string).slice(1).toLowerCase()
                    }
                }
            )
        } else {
            dishes = await menuRepo.find()
        }
        ctx.body = {
            data: {dishes}
        }
    }

    static async getDish(ctx:Koa.Context): Promise<void> {
        const menuRepo: Repository<Dish> = getRepository(Dish)
        const dish: Dish = await menuRepo.findOne(ctx.params.dish_id)
        if (!dish) {
            ctx.throw(HttpStatus.NOT_FOUND)
        }
        ctx.body = {
            data: {dish}
        }
    }

    static async addDish(ctx:Koa.Context): Promise<void> {
        const menuRepo: Repository<Dish> = getRepository(Dish)
        const dish: Dish[] = menuRepo.create(ctx.request.body)
        await menuRepo.save(dish)
        ctx.body = {
            data: {dish}
        }
    }

    static async deleteDish(ctx: Koa.Context): Promise<void> {
        const menuRepo: Repository<Dish> = getRepository(Dish)
        const dish: Dish = await menuRepo.findOne(ctx.params.dish_id)
        if (!dish) {
            ctx.throw(HttpStatus.NOT_FOUND)
        }
        await menuRepo.delete(dish)
    
        ctx.status = HttpStatus.NO_CONTENT
    }

    static async updateDish(ctx: Koa.Context): Promise<void> {
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
    }
}