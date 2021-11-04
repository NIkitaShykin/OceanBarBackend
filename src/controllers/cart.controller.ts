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
        const userRepo: Repository<User> = getRepository(User)
        const orderRepo: Repository<Order> = getRepository(Order)
        const menuRepo: Repository<Dish> = getRepository(Dish)

        const user: User = await userRepo.findOne(ctx.params.user_id)
        let order: Order = await orderRepo.findOne({
            where: {
                user: user,
                state: 'Initial',
            }
        })
        if (!order) ctx.throw(HttpStatus.NOT_FOUND, 'User has no order')
        let cart: CartPosition[] = await cartRepo.find({
            where: {
                order: order
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

        const user: User = await userRepo.findOne(ctx.params.user_id)
        let order: Order = await orderRepo.findOne({
            where: {
                user: user,
                state: 'Initial',
            }
        })
        if (!order) {
            const newOrder: Order = orderRepo.create({
                price: 0,
                state: 'Initial',
                user: user,
                cartPositions: []
            })
            await orderRepo.save(newOrder)
            order = newOrder
        }
        const dish: Dish = await menuRepo.findOne(ctx.request.body.dish_id)
        if(!dish) ctx.throw(HttpStatus.NOT_FOUND, 'Dish is not found')
        const cartPosition: CartPosition = cartRepo.create({
            dish: dish,
            ingredients: ctx.request.body.ingredienst || dish.ingredients,
            quantity: ctx.request.body.quantity || 1,
            order: order,
        })
        await cartRepo.save(cartPosition)
        ctx.body = {
            cartPosition
        }
    }

    static async DeleteDishFromCard(ctx: Koa.Context){
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const userRepo: Repository<User> = getRepository(User)
        const orderRepo: Repository<Order> = getRepository(Order)
        const menuRepo: Repository<Dish> = getRepository(Dish)

        const user: User = await userRepo.findOne(ctx.params.user_id)
        let order: Order = await orderRepo.findOne({
            where: {
                user: user,
                state: 'Initial',
            }
        })
        if (!order) ctx.throw(HttpStatus.NOT_FOUND, 'No order for this User')
        const cartPosition: CartPosition = await cartRepo.findOne(ctx.params.pos_id)
        if (!cartPosition) ctx.throw(HttpStatus.NOT_FOUND, 'No cart position found')
        await cartRepo.delete(cartPosition)

        ctx.status = HttpStatus.NO_CONTENT
    }

    static async DeleteCart(ctx: Koa.Context) {
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const userRepo: Repository<User> = getRepository(User)
        const orderRepo: Repository<Order> = getRepository(Order)
        const menuRepo: Repository<Dish> = getRepository(Dish)

        const user: User = await userRepo.findOne(ctx.params.user_id)
        let order: Order = await orderRepo.findOne({
            where: {
                user: user,
                state: 'Initial',
            }
        })
        if (!order) ctx.throw(HttpStatus.NOT_FOUND, 'No order for this User')
        const cartPositions: CartPosition[] = await cartRepo.find({
            where: {
                order: order
            }
        })
        if (!cartPositions) ctx.throw(HttpStatus.NOT_FOUND, 'No cart position found')
        await cartRepo.delete({
            order: order
        })

        await orderRepo.delete(order)

        ctx.status = HttpStatus.NO_CONTENT
    }

    static async UpdatePosition(ctx: Koa.Context){
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const userRepo: Repository<User> = getRepository(User)
        const orderRepo: Repository<Order> = getRepository(Order)
        const menuRepo: Repository<Dish> = getRepository(Dish)

        const user: User = await userRepo.findOne(ctx.params.user_id)
        let order: Order = await orderRepo.findOne({
            where: {
                user: user,
                state: 'Initial',
            }
        })
        if (!order) ctx.throw(HttpStatus.NOT_FOUND, 'No order for this User')
        const cartPosition: CartPosition = await cartRepo.findOne(ctx.params.pos_id)
        if (!cartPosition) ctx.throw(HttpStatus.NOT_FOUND, 'No cart position found')
        const updatedPosition: CartPosition = await cartRepo.merge(cartPosition, ctx.request.body)

        cartRepo.save(updatedPosition)

        ctx.body = {
            updatedPosition
        }
    }

}
