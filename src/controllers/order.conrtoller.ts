import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import {getRepository, Repository} from 'typeorm'

import Order from '../models/order.entity'
import Dish from '../models/menu.entity'
import CartPosition from '../models/cart.entity'
import TimetobookEntity from '../models/timetobook.entity';
import OrderDish from '../models/orderDish.entity'

export default class OrderController {
    static async addOrder(ctx: Koa.Context) {
        const cartRepo: Repository<CartPosition> = getRepository(CartPosition)
        const orderRepo: Repository<Order> = getRepository(Order)
        const dishesOrderRepo: Repository<OrderDish> = getRepository(OrderDish)

        const cart: CartPosition[] = await cartRepo.find({
            where: {
                user: ctx.params.user_id,
            },
            relations: ['dish']
        })
        let dishes: OrderDish[] = dishesOrderRepo.create(cart)
    
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
            state: 'В процессе'
        })

        await orderRepo.save(order)
        const newDishes: OrderDish[] = dishes.map(val=> {
            val.order = order
            return val
        })
        
        await dishesOrderRepo.save(newDishes)
        await cartRepo.delete({
            user: {
                id: ctx.params.user_id
            }
        })

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
            relations: ['dishes'],
        })
        ctx.body = {
            orders
        }
    }

    static async getDishes(ctx: Koa.Context) {
        const dishesOrderRepo: Repository<OrderDish> = getRepository(OrderDish)
        const dishes = await dishesOrderRepo.find(
            {
                /* where: {
                    order: {
                        id: ctx.params.order_id
                    }
                }, */
                relations: [ 'dish', 'order']
            }
        )
        ctx.body = {
            dishes
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
        order.state === 'В процессе' ? updatedOrder.state = 'Выполнен' : updatedOrder.state = 'В процессе'
        orderRepo.save(updatedOrder)

        ctx.body = {
            updatedOrder
        }
    }
}
