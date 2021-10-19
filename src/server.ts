require('dotenv').config()
import app from "./app/app"
import connectToDB from "./database/database.connection"

const PORT: number = Number(process.env.PORT) || 3000

if (connectToDB){
    app.listen(PORT)
} else {
    console.error
}