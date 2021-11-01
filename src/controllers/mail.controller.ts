import {MessageType} from "../routes/user.routes";

const nodemailer = require('nodemailer')

if (!process.env.MAIL || !process.env.MAIL_PASS){
    throw new Error('MAIL and MAIL_PASS environment variables are required');
}
const transporter = nodemailer.createTransport(
    {
        host: `${process.env.MAIL_HOST}` || 'smtp.gmail.com',
        port: process.env.MAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: `${process.env.MAIL}`,
            pass: `${process.env.MAIL_PASS}`
        }
    },
    {
        from: `Mailer Test <${process.env.MAIL}>`,
    }
)

const mailer:any = (message:MessageType):void => {
    transporter.sendMail(message, (err :string, info:string) => {
        if(err) return console.log(err)
    })
}

export default mailer
