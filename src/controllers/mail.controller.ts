const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'felton.rippin2@ethereal.email',
            pass: 'b5CGaHtWA5rvdKm6sZ'
        }
    },
    {
        from: 'Mailer Test <felton.rippin2@ethereal.email>',
    }
)

const mailer:any = (message:any):any => {
    transporter.sendMail(message, (err :any, info:any) => {
        if(err) return console.log(err)
        console.log('Email sent: ', info)
    })
}

export default mailer
