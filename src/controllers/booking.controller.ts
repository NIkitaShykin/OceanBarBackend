import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import {getRepository, Repository} from 'typeorm'
import Tables from "../models/tables.entity";
import Booking from "../models/booking.entity";


export default class BookingController {
    static async getBooking(ctx: Koa.Context) {
        const timeArray: string[] = [
            '10:00', '10:30',
            '11:00', '11:30',
            '12:00', '12:30',
            '13:00', '13:30',
            '14:00', '14:30',
            '15:00', '15:30',
            '16:00', '16:30',
            '17:00', '17:30',
            '18:00', '18:30',
            '19:00', '19:30',
            '20:00', '20:30',
            '21:00'
        ]
        const bookingRepo: Repository<Booking> = getRepository(Booking)
        let booked: Booking[] = await bookingRepo.find({
            where: {
                date: ctx.request.query.date
            }
        })
        const tables: Repository<Tables> = getRepository(Tables)
        let amounts = await tables.find()
        let newArr:string[]
        let notAllowedArr: Booking[] = []
        newArr = [...timeArray]
        switch (ctx.request.query.index) {
            case '0':
                booked.forEach((el) => {
                    if (el.forTwoPersons > amounts[0].maxamount) {
                        notAllowedArr.push(el)
                    }
                })
                notAllowedArr.forEach((el) => {
                        delete newArr[newArr.indexOf(`${el.time}`)]
                    }
                )
                break;
            case '1':
                booked.forEach((el) => {
                    if (el.forFourPersons > amounts[1].maxamount) {
                        notAllowedArr.push(el)
                    }
                })
                notAllowedArr.forEach((el) => {
                        delete newArr[newArr.indexOf(`${el.time}`)]
                    }
                )
                break;
            case '2':
                booked.forEach((el) => {
                    if (el.forSixPersons > amounts[2].maxamount) {
                        notAllowedArr.push(el)
                    }
                })
                notAllowedArr.forEach((el) => {
                        delete newArr[newArr.indexOf(`${el.time}`)]
                    }
                )
                break;
            case '3':
                booked.forEach((el) => {
                    if (el.forEighthPersons > amounts[3].maxamount) {
                        notAllowedArr.push(el)
                    }
                })
                notAllowedArr.forEach((el) => {
                        delete newArr[newArr.indexOf(`${el.time}`)]
                    }
                )
                break;
            case '4':
                booked.forEach((el) => {
                    if (el.forTenPersons > amounts[4].maxamount) {
                        notAllowedArr.push(el)
                    }
                })
                notAllowedArr.forEach((el) => {
                        delete newArr[newArr.indexOf(`${el.time}`)]
                    }
                )
                break;
            default:
                throw ctx.throw(HttpStatus.BAD_REQUEST, 'такого кол-ва гостей не сущетсвует ')
        }
        ctx.body = {
            data: newArr
        }
    }

    static async createBooking(ctx: Koa.Context) {
        const bookingRepo: Repository<Booking> = getRepository(Booking)
        let booked: Booking = await bookingRepo.findOne({
            where: {
                date: ctx.request.body.date,
                time: ctx.request.body.time
            }
        })
        console.log(booked)
        let booking
        if (!booked) {
            booking = bookingRepo.create(ctx.request.body)
            await bookingRepo.save(booking)
        } else {
                let updateBooked: Booking
            switch (ctx.request.query.index) {
                case '0':
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forTwoPersons: ctx.request.body.forTwoPersons + booked.forTwoPersons,
                    }
                    break;
                case '1':
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forFourPersons: ctx.request.body.forFourPersons + booked.forFourPersons,
                    }
                    break;
                case '2':
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forSixPersons: ctx.request.body.forSixPersons + booked.forSixPersons,
                    }
                    break;
                case '3':
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forEighthPersons: ctx.request.body.forEighthPersons + booked.forEighthPersons,
                    }
                    break;
                case '4':
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
