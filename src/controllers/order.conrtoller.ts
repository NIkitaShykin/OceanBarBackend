import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import {getRepository, Repository} from 'typeorm'

import Order from '../models/order.entity'
import Dish from '../models/menu.entity'
import CartPosition from '../models/cart.entity'
import TimetobookEntity from '../models/timetobook.entity';

export default class OrderController {
    static async addOrder(ctx: Koa.Context) {
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const orderRepo: Repository<Order> = getRepository(Order)

        const cart: CartPosition[] = await cartRepo.find({
            where: {
                user: ctx.params.user_id,
            },
            relations: ['dish']
        })

        const dishes: Dish[] = cart.map((current) => {
            return current.dish
        })

        const {type, date, time, price, paymentType, tableSize, address} = ctx.request.body
        const order: Order = orderRepo.create({
            user: ctx.params.user_id,
            dishes: dishes,
            type: type,
            date: date,
            time: time,
            price: price,
            paymentType: paymentType,
            tableSize: tableSize,
            address: address,
            state: 'in progress'
        })

        await orderRepo.save(order)

        ctx.body = {
            order
        }
    }

    static async getOrders(ctx: Koa.Context) {
        const orderRepo: Repository<Order> = getRepository(Order)

        const orders: Order[] = await orderRepo.find({
            where: {
                user: ctx.params.user_id,
            },
            relations: ['user', 'dishes'],
        })
        ctx.body = {
            orders
        }
    }

    static async getTimeForTakeaway(ctx: Koa.Context) {
        const timeArray: Repository<TimetobookEntity> = getRepository(TimetobookEntity)
        let time = await timeArray.find()
        let availableTime = [...time.map((el) => {
            return el.avalibletime
        })]
        ctx.body = {
            availableTime
        }
    }

    static async getOrderById(ctx: Koa.Context) {
        const orderRepo: Repository<Order> = getRepository(Order)

        const order: Order = await orderRepo.findOne({
            where: {
                id: ctx.params.order_id
            },
            relations: ['user', 'dishes'],
        })

        if (!order) {
            ctx.throw(HttpStatus.NOT_FOUND)
        }

        ctx.body = {
            order: order
        }
    }

    static async deleteOrder(ctx: Koa.Context) {
        const orderRepo: Repository<Order> = getRepository(Order)

        const order: Order = await orderRepo.findOne({
            where: {
                user: ctx.params.user_id,
            },
            relations: ['user', 'dishes'],
        })

        if (!order) {
            ctx.throw(HttpStatus.NOT_FOUND)
        }

        await orderRepo.delete(ctx.params.order_id)
        ctx.status = HttpStatus.NO_CONTENT
    }

    static async updateOrder(ctx: Koa.Context) {
        const orderRepo: Repository<Order> = getRepository(Order)

        const order: Order = await orderRepo.findOne({
            where: {
                id: ctx.params.order_id,
            },
            relations: ['user'],
        })

        if (!order) ctx.throw(HttpStatus.NOT_FOUND, 'No order found')
        const updatedOrder: Order = await orderRepo.merge(order, ctx.request.body)
        order.state === 'in progress' ? updatedOrder.state = 'done' : updatedOrder.state = 'in progress'
        orderRepo.save(updatedOrder)

        ctx.body = {
            updatedOrder
        }
    }
}
