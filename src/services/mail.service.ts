import { MessageType } from '../controllers/user.controller';
import * as nodemailer from 'nodemailer'
import SMTPTransport = require("nodemailer/lib/smtp-transport")

if (!process.env.MAIL || !process.env.MAIL_PASS){
    throw new Error('MAIL and MAIL_PASS environment variables are required');
}

const smtp: SMTPTransport.Options = {
    host: `${process.env.MAIL_HOST}` || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: `${process.env.MAIL}`,
        pass: `${process.env.MAIL_PASS}`
    }
}

const transporter: nodemailer.Transporter = nodemailer.createTransport(smtp,
    {
        from: `Mailer Test <${process.env.MAIL}>`,
    }
)

function mailer(message: MessageType): void {
    transporter.sendMail(message, (err: Error, info: string): void => {
        if (err) return console.log(err)
    })
}

export default mailer
