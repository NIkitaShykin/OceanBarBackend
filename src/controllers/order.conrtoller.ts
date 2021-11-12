import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import { getRepository, Repository } from 'typeorm'

import Order from '../models/order.entity'
import Dish from '../models/menu.entity'
import CartPosition from '../models/cart.entity'

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

    const currrentOrder: Order = await orderRepo.findOne({
      where: {
        user: ctx.params.user_id,
      }
    })

    if (currrentOrder) {
      await orderRepo.delete({
        user: ctx.params.user_id,
      })
    }

    const order: Order = await orderRepo.create({
      dishes: dishes,
      state: ctx.request.body.state,
      type: ctx.request.body.type,
      date: ctx.request.body.date,
      time: ctx.request.body.time,
      price: ctx.request.body.price,
      paymentType: ctx.request.body.paymentType,
      tableSize: ctx.request.body.tableSize,
      address: ctx.request.body.address,
      user: ctx.params.user_id
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

  static async getOrderById(ctx: Koa.Context) {
    const orderRepo: Repository<Order> = getRepository(Order)

    const order: Order = await orderRepo.findOne({
      where: {
        user: ctx.params.user_id,
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

  // *** to be implemented further / having issues with delete option
  static async deleteOrder(ctx: Koa.Context) {
    const orderRepo: Repository<Order> = getRepository(Order)

    const order: Order = await orderRepo.findOne({
      where: {
        user: ctx.params.user_id,
      },
      relations: ['user', 'dishes'],
    })

    // const cancelledOrder: Order = {
    //   dishes: [],
    //   user: {}
    // }

    if (!order) {
      ctx.throw(HttpStatus.NOT_FOUND)
    }

    // order = await orderRepo.merge(order, cancelledOrder)
    // await orderRepo.save(order)

    await orderRepo.delete(ctx.params.order_id)

    ctx.status = HttpStatus.NO_CONTENT
  }
}
