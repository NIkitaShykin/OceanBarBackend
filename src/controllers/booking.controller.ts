import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import {getRepository, Repository} from 'typeorm'
import Tables from "../models/tables.entity";
import Booking from "../models/booking.entity";

export default class BookingController {
    static async getBooking(ctx: Koa.Context) {
        const bookingRepo: Repository<Booking> = getRepository(Booking)
        let date = await bookingRepo.find()
        ctx.body = {
            data: date
        }
    }

    static async createBooking(ctx: Koa.Context) {
        const bookingRepo: Repository<Booking> = getRepository(Booking)
        const tables: Repository<Tables> = getRepository(Tables)
        let booked: Booking = await bookingRepo.findOne({
            where: {
                date: ctx.request.body.date,
                time: ctx.request.body.time
            }
        })
        let booking
        if (!booked) {
            booking = bookingRepo.create(ctx.request.body)
            await bookingRepo.save(booking)
        } else {
            let amounts = await tables.find()
            let updateBooked: Booking
            switch (ctx.request.query.index) {
                case '0':
                    if (ctx.request.body.forTwoPersons + booked.forTwoPersons > amounts[0].maxamount) {
                        ctx.throw(HttpStatus.BAD_REQUEST, 'Больше столов нет')
                    }
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forTwoPersons: ctx.request.body.forTwoPersons + booked.forTwoPersons,
                    }
                    break;
                case '1':
                    if (ctx.request.body.forTwoPersons + booked.forTwoPersons > amounts[1].maxamount) {
                        ctx.throw(HttpStatus.BAD_REQUEST, 'Больше столов нет')
                    }
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forFourPersons: ctx.request.body.forFourPersons + booked.forFourPersons,
                    }
                    break;
                case '2':
                    if (ctx.request.body.forTwoPersons + booked.forTwoPersons > amounts[2].maxamount) {
                        ctx.throw(HttpStatus.BAD_REQUEST, 'Больше столов нет')
                    }
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forSixPersons: ctx.request.body.forSixPersons + booked.forSixPersons,
                    }
                    break;
                case '3':
                    if (ctx.request.body.forTwoPersons + booked.forTwoPersons > amounts[3].maxamount) {
                        ctx.throw(HttpStatus.BAD_REQUEST, 'Больше столов нет')
                    }
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forEighthPersons: ctx.request.body.forEighthPersons + booked.forEighthPersons,
                    }
                    break;
                case '4':
                    if (ctx.request.body.forTwoPersons + booked.forTwoPersons > amounts[4].maxamount) {
                        ctx.throw(HttpStatus.BAD_REQUEST, 'Больше столов нет')
                    }
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forTenPersons: ctx.request.body.forTenPersons + booked.forTenPersons,
                    }
                    break;
                default:
                    throw ctx.throw(HttpStatus.BAD_REQUEST, 'такого кол-ва гостей не сущетсвует ')
            }
            booking = bookingRepo.merge(booked, updateBooked)
            await bookingRepo.save(booking)
        }
        ctx.body = {
            data: booking
        }
    }
}
