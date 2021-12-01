import {getRepository, Repository} from 'typeorm';
import Tables from '../models/tables.entity';
import Booking from '../models/booking.entity';
import TimetobookEntity from '../models/timetobook.entity';
import * as Koa from 'koa'
import * as HttpStatus from 'http-status-codes'

export async function getAvailableTime(index: number, booked: Booking[], amountOfPeople: string) {
    const tables: Repository<Tables> = getRepository(Tables)
    const timeArray: Repository<TimetobookEntity> = getRepository(TimetobookEntity)
    const time = await timeArray.find()
    const amounts = await tables.find()
    const notAllowedArr: Booking[] = []
    let newArr: string[] = [...time.map((el: TimetobookEntity) => {
        return el.avalibletime
    })]
    booked.forEach((el: Booking) => {
        if (el[amountOfPeople as keyof Booking] >= amounts[index].maxamount) {
            notAllowedArr.push(el)
        }
    })
    notAllowedArr.forEach((el: Booking) => {
            delete newArr[newArr.indexOf(`${el.time}`)]
        }
    )
    return newArr
}

export async function createNewReservation(date: string, time: string, amountOfPeople: number, ctx?: Koa.Context) {
    let booking
    const bookingRepo: Repository<Booking> = getRepository(Booking)
    switch (amountOfPeople) {
        case 2:
            booking = bookingRepo.create({
                date,
                time,
                forTwoPersons: 1
            })
            break
        case 4:
            booking = bookingRepo.create({
                date,
                time,
                forFourPersons: 1
            })
            break;
        case 6:
            booking = bookingRepo.create({
                date,
                time,
                forSixPersons: 1
            })
            break;
        case 8:
            booking = bookingRepo.create({
                date,
                time,
                forEighthPersons: 1
            })
            break;
        case 10:
            booking = bookingRepo.create({
                date,
                time,
                forTenPersons: 1
            })
            break;
        default:
            throw ctx.throw(HttpStatus.BAD_REQUEST, 'такого кол-ва гостей не сущетсвует ')
    }
    return booking
}

export async function createReservation(date: string, time: string, booked: Booking, amountOfPeople: number, ctx?: Koa.Context) {
    let updateBooked: Booking
    switch (amountOfPeople) {
        case 2:
            if (booked.forTwoPersons >= 7) {
                throw ctx.throw(HttpStatus.BAD_REQUEST, 'больше свободных столов на это время нет ')
            }
            updateBooked = {
                date,
                time,
                forTwoPersons: 1 + booked.forTwoPersons,
            }
            break
        case 4:
            if (booked.forFourPersons >= 7) {
                throw ctx.throw(HttpStatus.BAD_REQUEST, 'больше свободных столов на это время нет ')
            }
            updateBooked = {
                date,
                time,
                forFourPersons: 1 + booked.forFourPersons,
            }
            break;
        case 6:
            if (booked.forSixPersons >= 5) {
                throw ctx.throw(HttpStatus.BAD_REQUEST, 'больше свободных столов на это время нет ')
            }
            updateBooked = {
                date,
                time,
                forSixPersons: 1 + booked.forSixPersons,
            }
            break;
        case 8:
            if (booked.forEighthPersons >= 5) {
                throw ctx.throw(HttpStatus.BAD_REQUEST, 'больше свободных столов на это время нет  ')
            }
            updateBooked = {
                date,
                time,
                forEighthPersons: 1 + booked.forEighthPersons,
            }
            break;
        case 10:
            if (booked.forTenPersons >= 3) {
                throw ctx.throw(HttpStatus.BAD_REQUEST, 'больше свободных столов на это время нет  ')
            }
            updateBooked = {
                date,
                time,
                forTenPersons: 1 + booked.forTenPersons,
            }
            break;
        default:
            throw ctx.throw(HttpStatus.BAD_REQUEST, 'такого количества гостей нет')
    }
    return updateBooked
}
