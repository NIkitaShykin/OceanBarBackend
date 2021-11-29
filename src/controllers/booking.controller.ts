import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'
import {getRepository, Repository} from 'typeorm'
import Booking from '../models/booking.entity';
import BookedUsersEntity from '../models/bookedusers.entity';
import {createNewReservation, createReservation, getAvailableTime} from '../services/booking.service';
import Dish from "../models/menu.entity";


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

    static async getUsersBooking(ctx: Koa.Context) {
        const bookingUserRepo: Repository<BookedUsersEntity> = getRepository(BookedUsersEntity)
        if (ctx.request.query.id) {
            const booked: Booking[] = await bookingUserRepo.find({
                where: {
                    id: ctx.request.query.id
                }
            })
            return ctx.body = {
                booked
            }
        }
        const bookedUsers = await bookingUserRepo.find()
        ctx.body = {
            bookedUsers
        }
    }
    static async deleteUsersBooking(ctx: Koa.Context) {
        const bookingUserRepo: Repository<BookedUsersEntity> = getRepository(BookedUsersEntity)
        const bookedUsers = await bookingUserRepo.findOne({
            where:{
                id:ctx.request.query.id
            }
        })
        if (!bookedUsers)  ctx.throw(HttpStatus.NOT_FOUND)
        await bookingUserRepo.delete(bookedUsers)
        ctx.status = HttpStatus.NO_CONTENT

    }

    static async updateBooking(ctx: Koa.Context) {
        const bookingUserRepo: Repository<BookedUsersEntity> = getRepository(BookedUsersEntity)
        const oldBooking = await bookingUserRepo.findOne({
            where: {
                id: ctx.request.query.id
            }
        })
        if (!oldBooking) ctx.throw(HttpStatus.NOT_FOUND, 'No cart position found')
        const updatedBooking = await bookingUserRepo.merge(oldBooking, ctx.request.body)
        await bookingUserRepo.save(updatedBooking)
        ctx.body = {
            updatedBooking
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
        const userBooking = usersBookedRepo.create({
            name: ctx.request.body.name,
            phone: ctx.request.body.phone,
            date: ctx.request.body.date,
            time: ctx.request.body.time,
            amountofpeople: ctx.request.body.amountofpeople
        })

        await usersBookedRepo.save(userBooking)
        if (!booked) {
            booking = await createNewReservation(ctx.request.body.date, ctx.request.body.time, ctx.request.body.amountofpeople)
            await bookingRepo.save(booking)
        } else {
            updateBooked = await createReservation(ctx.request.body.date, ctx.request.body.time, booked, ctx.request.body.amountofpeople, ctx)
        }
        booking = bookingRepo.merge(booked, updateBooked)
        await bookingRepo.save(booking)
        ctx.body = {
            data: booked
        }
    }

}
