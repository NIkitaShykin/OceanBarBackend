import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import {getRepository, Repository} from 'typeorm'
import Tables from "../models/tables.entity";
import Booking from "../models/booking.entity";
import TimetobookEntity from "../models/timetobook.entity";
import BookedUsersEntity from "../models/bookedusers.entity";


export default class BookingController {
    static async getBooking(ctx: Koa.Context) {
        const timeArray: Repository<TimetobookEntity> = getRepository(TimetobookEntity)
        let time = await timeArray.find()
        const bookingRepo: Repository<Booking> = getRepository(Booking)
        let booked: Booking[] = await bookingRepo.find({
            where: {
                date: ctx.request.query.date
            }
        })
        const tables: Repository<Tables> = getRepository(Tables)
        let amounts = await tables.find()
        let newArr: string[]
        let notAllowedArr: Booking[] = []
        newArr = [...time.map((el) => {
            return el.avalibletime
        })]
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
        const usersbookedRepo: Repository<BookedUsersEntity> = getRepository(BookedUsersEntity)
        let booked: Booking = await bookingRepo.findOne({
            where: {
                date: ctx.request.body.date,
                time: ctx.request.body.time
            }
        })
        let booking
        let userBooking
        if (!booked) {
            booking = bookingRepo.create(ctx.request.body)
            userBooking = usersbookedRepo.create({
                name: ctx.request.body.name,
                phone: ctx.request.body.phone,
                date: ctx.request.body.date,
                time: ctx.request.body.time,
                amountofpeople: ctx.request.body.amountofpeople
            })
            await bookingRepo.save(booking)
            await usersbookedRepo.save(userBooking)
        } else {
            let updateBooked: Booking
            userBooking = usersbookedRepo.create({
                name: ctx.request.body.name,
                phone: ctx.request.body.phone,
                date: ctx.request.body.date,
                time: ctx.request.body.time,
                amountofpeople: ctx.request.body.amountofpeople
            })
            await usersbookedRepo.save(userBooking)
            switch (ctx.request.body.amountofpeople) {
                case 2:
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forTwoPersons: 1 + booked.forTwoPersons,
                    }
                    break;
                case 4:
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forFourPersons: 1 + booked.forFourPersons,
                    }
                    break;
                case 6:
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forSixPersons: 1 + booked.forSixPersons,
                    }
                    break;
                case 8:
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forEighthPersons: 1 + booked.forEighthPersons,
                    }
                    break;
                case 10:
                    updateBooked = {
                        date: ctx.request.body.date,
                        time: ctx.request.body.time,
                        forTenPersons: 1 + booked.forTenPersons,
                    }
                    break;
                default:
                    throw ctx.throw(HttpStatus.BAD_REQUEST, 'такого кол-ва гостей не сущетсвует ')
            }
            booking = bookingRepo.merge(booked, updateBooked)

            await bookingRepo.save(booking)
        }
        ctx.body = {
            data: userBooking
        }
    }
}
