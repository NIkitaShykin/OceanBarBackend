import 'reflect-metadata'
require('dotenv').config()
import{ getConnection, createConnection, Connection, ConnectionOptions } from 'typeorm'
import Dish from '../models/menu.entity'
import User from '../models/user.entity'

if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD){
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
        Dish, User
    ],
    synchronize: true,
}

const connectToDB = async ()=> {
    await createConnection(connectionOpts)
    .then(() => {return getConnection()})
    .catch(console.error)
}
export default connectToDB()
