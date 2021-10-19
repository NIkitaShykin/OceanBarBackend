import 'reflect-metadata'
import{ createConnection, Connection, ConnectionOptions } from 'typeorm'
import Dish from '../models/menu.entity'
import User from '../models/user.entity'

const connectionOpts: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'qwerty',
    database: process.env.DB_NAME || 'oceanbardb',
    entities: [
        Dish, User
    ],
    synchronize: true,
}

const databaseConnection: Promise<Connection> = createConnection(connectionOpts)

export default databaseConnection