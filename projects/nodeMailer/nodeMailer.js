import nodemailer from 'nodemailer'
import {cronUser, cronPass} from '../../keys/users.js'

const transporter = nodemailer.createTransport({
    host: "smtp.dreamhost.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: cronUser,
        pass: cronPass,
    },
})

// async_await is not allowed in global scope, must use a wrapper
export async function sendEmail(subject, text, html, to, attachments) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"Cron" <${cronUser}>`,   // sender address
        to: to,                         // list of receivers, comma separated
        subject: subject,               // Subject line
        text: text,                     // plain text body
        html: html,                     // html body
        attachments: attachments,     // array of attachment objects
    })

    //console.log("Message sent: %s", info.messageId)
}

//await sendEmail('New RAFL Entries - gmail','message body', 'baylessdesign@gmail.com')
