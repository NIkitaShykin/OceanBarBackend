const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASS
        }
    },
    {
        from: `Mailer Test <${process.env.MAIL}>`,
    }
)

const mailer:any = (message:any):any => {
    transporter.sendMail(message, (err :any, info:any) => {
        if(err) return console.log(err)
    })
}

export default mailer
