import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import {getRepository, Repository} from 'typeorm'
import Booking from '../models/booking.entity';
import BookedUsersEntity from '../models/bookedusers.entity';
import {createReservation, getAvailableTime} from '../services/booking.service';


export default class BookingController {
    static async getBooking(ctx: Koa.Context) {
        const bookingRepo: Repository<Booking> = getRepository(Booking)
        const booked: Booking[] = await bookingRepo.find({
            where: {
                date: ctx.request.query.date
            }
        })
        let resp: string[]
        switch (ctx.request.query.index) {
            case '0':
                resp = await getAvailableTime(0, booked, 'forTwoPersons')
                break
            case '1':
                resp = await getAvailableTime(1, booked, 'forFourPersons')
                break
            case '2':
                resp = await getAvailableTime(2, booked, 'forSixPersons')
                break
            case '3':
                resp = await getAvailableTime(3, booked, 'forEightPersons')
                break
            case '4':
                resp = await getAvailableTime(4, booked, 'forTenPersons')
                break
            default:
                throw ctx.throw(HttpStatus.BAD_REQUEST, 'такого кол-ва гостей не сущетсвует ')
        }
        ctx.body = {
            data: resp
        }
    }

    static async createBooking(ctx: Koa.Context) {
        const bookingRepo: Repository<Booking> = getRepository(Booking)
        const usersBookedRepo: Repository<BookedUsersEntity> = getRepository(BookedUsersEntity)
        let booked: Booking = await bookingRepo.findOne({
            where: {
                date: ctx.request.body.date,
                time: ctx.request.body.time
            }
        })
        let booking
        let updateBooked: any
        if (ctx.request.body.amountofpeople > 10) {
            throw ctx.throw(HttpStatus.BAD_REQUEST, 'такого кол-ва гостей не сущетсвует ')
        }
        const userBooking = usersBookedRepo.create({
            name: ctx.request.body.name,
            phone: ctx.request.body.phone,
            date: ctx.request.body.date,
            time: ctx.request.body.time,
            amountofpeople: ctx.request.body.amountofpeople
        })
        await usersBookedRepo.save(userBooking)
        if (!booked) {
            booking = bookingRepo.create(ctx.request.body)
            await bookingRepo.save(booking)
        } else {
            updateBooked = await createReservation(ctx.request.body.date, ctx.request.body.time, booked, ctx.request.body.amountofpeople)
        }
        booking = bookingRepo.merge(booked, updateBooked)
        await bookingRepo.save(booking)
        ctx.body = {
            data: userBooking
        }
    }

}
