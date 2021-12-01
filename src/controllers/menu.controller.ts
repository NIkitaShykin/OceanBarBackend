import * as Koa from 'koa'
import {getRepository, Repository} from 'typeorm'
import Dish from '../models/menu.entity'
import * as HttpStatus from 'http-status-codes'
import {Like, FindOperator} from "typeorm";
import * as formidable from 'formidable'
import uploadToS3 from '../services/image.service';

type MenuCondition = {
    name?: FindOperator<string>,
    where?:  {
        dishCategory?: string,
    }
}

function capitalize(value: string): string {
    value = value.trim()
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export default class MenuController {

    static async getMenu(ctx: Koa.Context): Promise<void> {
        const menuRepo: Repository<Dish> = getRepository(Dish)
        let condition: MenuCondition = {}
        if (ctx.request.query.name) condition.name = Like(`%${ctx.request.query.name.toString().toUpperCase()}%`)
        if (ctx.request.query.category) condition.where = {dishCategory: capitalize(ctx.request.query.category.toString())}
        const dishes: Dish[] = await menuRepo.find(condition)
        ctx.body = {
            data: {dishes},
        }
    }

    static async getDish(ctx:Koa.Context): Promise<void> {
        const menuRepo: Repository<Dish> = getRepository(Dish)
        const dish: Dish = await menuRepo.findOne(ctx.params.dish_id)
        if (!dish) ctx.throw(HttpStatus.NOT_FOUND)

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
        if (!dish) ctx.throw(HttpStatus.NOT_FOUND)

        await menuRepo.delete(dish)
    
        ctx.status = HttpStatus.NO_CONTENT
    }

    static async updateDish(ctx: Koa.Context): Promise<void> {
        const menuRepo: Repository<Dish> = getRepository(Dish)
        const dish: Dish = await menuRepo.findOne(ctx.params.dish_id)
        if (!dish) ctx.throw(HttpStatus.NOT_FOUND)
    
        const updatedDish: Dish = await menuRepo.merge(dish, ctx.request.body)
    
        menuRepo.save(updatedDish)
    
        ctx.body = {
            data: {dish: updatedDish}
        }
    }

    static async uploadImage(ctx: Koa.Context): Promise<void> {
        if (!ctx.request.files.file) ctx.throw(HttpStatus.BAD_REQUEST, 'Please add file, to body')
        const file: formidable.File = ctx.request.files.file as formidable.File

        const imageURL: string = await uploadToS3(file.path, ctx.request.body.name, ctx.request.body.category)
        if (!imageURL) ctx.throw(HttpStatus.BAD_REQUEST, 'Error while uploading file, try later please')
        ctx.body = {
            url: imageURL
        }
    }

}
