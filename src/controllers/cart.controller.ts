import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import { getRepository, Repository } from 'typeorm'
import CartPosition from '../models/cart.entity'
import User from '../models/user.entity'
import Dish from '../models/menu.entity'
import Order from '../models/order.entity'

export default class CartController {
    static async getCart(ctx: Koa.Context){
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)

        let cart: CartPosition[] = await cartRepo.find({
            where: {
                user: {
                    where: {
                        id: ctx.params.user.id,
                    }
                }
            },
            relations: ['dish'],
        })
        ctx.body = {
            cart
        }
    }

    static async addDishToCart(ctx: Koa.Context){
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const userRepo: Repository<User> = getRepository(User)
        const orderRepo: Repository<Order> = getRepository(Order)
        const menuRepo: Repository<Dish> = getRepository(Dish)

        const dish: Dish = await menuRepo.findOne(ctx.request.body.id)
        if(!dish) ctx.throw(HttpStatus.NOT_FOUND, 'Dish is not found')

        const cartPosition: CartPosition = cartRepo.create({
            dish: dish,
            ingredients: ctx.request.body.ingredients || dish.ingredients,
            quantity: ctx.request.body.quantity || 1,
            user: await userRepo.findOne(ctx.params.user_id),
        })
        await cartRepo.save(cartPosition)
        ctx.body = {
            cartPosition
        }
    }

    static async deleteDishFromCard(ctx: Koa.Context){
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)

        const cartPosition: CartPosition = await cartRepo.findOne(ctx.params.pos_id)
        if (!cartPosition) ctx.throw(HttpStatus.NOT_FOUND, 'No cart position found')
        await cartRepo.delete(cartPosition)

        ctx.status = HttpStatus.NO_CONTENT
    }

    static async deleteCart(ctx: Koa.Context) {
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const userRepo: Repository<User> = getRepository(User)

        const user: User = await userRepo.findOne(ctx.params.user_id)

        await cartRepo.delete({
            user: user
        })

        ctx.status = HttpStatus.NO_CONTENT
    }

    static async updatePosition(ctx: Koa.Context){
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const userRepo: Repository<User> = getRepository(User)
        const orderRepo: Repository<Order> = getRepository(Order)

        const cartPosition: CartPosition = await cartRepo.findOne(ctx.params.pos_id)
        if (!cartPosition) ctx.throw(HttpStatus.NOT_FOUND, 'No cart position found')
        const updatedPosition: CartPosition = await cartRepo.merge(cartPosition, ctx.request.body)

        cartRepo.save(updatedPosition)

        ctx.body = {
            updatedPosition
        }
    }

}
