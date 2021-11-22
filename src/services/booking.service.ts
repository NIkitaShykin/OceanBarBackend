import {getRepository, Repository} from "typeorm";
import Tables from "../models/tables.entity";
import Booking from "../models/booking.entity";
import TimetobookEntity from "../models/timetobook.entity";

export async function getAvailableTime(index: number, booked: Booking[], amountOfPeople: string) {
    const tables: Repository<Tables> = getRepository(Tables)
    const timeArray: Repository<TimetobookEntity> = getRepository(TimetobookEntity)
    const time = await timeArray.find()
    const amounts = await tables.find()
    const notAllowedArr: Booking[] = []
    let newArr: string[] = [...time.map((el) => {
        return el.avalibletime
    })]
    booked.forEach((el: any) => {
        if (el[amountOfPeople] > amounts[index].maxamount) {
            notAllowedArr.push(el)
        }
    })
    notAllowedArr.forEach((el) => {
            delete newArr[newArr.indexOf(`${el.time}`)]
        }
    )
    return newArr
}

export async function createReservation(date: string, time: string, booked: Booking, amountOfPeople: number) {
    let updateBooked:Booking
    switch (amountOfPeople) {
        case 2:
             updateBooked = {
                date,
                time,
                forTwoPersons: 1 + booked.forTwoPersons,
            }
            break
        case 4:
            updateBooked = {
                date,
                time,
                forFourPersons: 1 + booked.forFourPersons,
            }
            break;
        case 6:
            updateBooked = {
                date,
                time,
                forSixPersons: 1 + booked.forSixPersons,
            }
            break;
        case 8:
            updateBooked = {
                date,
                time,
                forEighthPersons: 1 + booked.forEighthPersons,
            }
            break;
        case 10:
            updateBooked = {
                date,
                time,
                forTenPersons: 1 + booked.forTenPersons,
            }
            break;
        default:
            throw new Error('такого кол-ва гостей не сущетсвует ')
    }
    return updateBooked
}
