import nodemailer from 'nodemailer'
import {emailConfigs} from '../../../keys/users.js'

// async_await is not allowed in global scope, must use a wrapper
export async function sendEmail(content) {

    //console.log('content', content)

    const transporter = nodemailer.createTransport({
        host: 'smtp.dreamhost.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: emailConfigs[content.emailConfig].user,
            pass: emailConfigs[content.emailConfig].pass,
        },
    })

    // send mail with defined transport object
    return await transporter.sendMail({
        from: `"${emailConfigs[content.emailConfig].name}" <${emailConfigs[content.emailConfig].user}>`,   // sender address
        to: content.to,                         // list of receivers, comma separated
        subject: content.subject,               // Subject line
        text: content.text,                     // plain text body
        html: content.html,                     // html body
        attachments: content.attachments,       // array of attachment objects
    })

}

//await sendEmail('New RAFL Entries - gmail','message body', 'baylessdesign@gmail.com')
