import 'reflect-metadata'
import {Connection, ConnectionOptions, createConnection} from 'typeorm'
import CartPosition from '../models/cart.entity'
import Dish from '../models/menu.entity'
import Order from '../models/order.entity'
import User from '../models/user.entity'
import Tables from "../models/tables.entity";
import Booking from "../models/booking.entity";
import TimeToBookEntity from "../models/timetobook.entity";
import BookedUsersEntity from "../models/bookedusers.entity";
import OrderDish from '../models/orderDish.entity'

require('dotenv').config()

if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
    throw new Error('DB_USERNAME and DB_PASSWORD environment variables are required');
}

const connectionOpts: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'oceanbardb',
    entities: [
        Dish, User, CartPosition, Order, Tables, Booking, TimeToBookEntity, BookedUsersEntity, OrderDish 
    ],
    synchronize: true,
}

const connectToDB: Promise<Connection> = createConnection(connectionOpts)

export default connectToDB
