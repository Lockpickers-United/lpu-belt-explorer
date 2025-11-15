import {formidable} from '../../util/formidable/src/index.js'
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {raflEmailRecipients} from '../../../keys/users.js'
import {logger} from '../../logger/logger.js'
import parseForm from '../../util/parseForm.js'
import dayjs from 'dayjs'

/**
 * @prop photoCredit
 */

const isDev = process.env.NODE_ENV !== 'production'
const dateTime = dayjs().format('YYYY-MM-DD HH:MM')

let detailsJson = {}

function handleError(res, message, error, status = 500) {
    logger.error(`handleError: ${message}`)

    if (res.headersSent) {
        logger.warn('handleError called but headers already sent')
        return
    }

    const payload = {
        error: {
            message: typeof message === 'string' ? message : (error?.message || 'Error'),
            code: error?.code,
            type: error?.name,
            details: error && typeof error === 'object' ? {
                formidableCode: error.code,
                errno: error.errno,
                syscall: error.syscall
            } : undefined,
            stack: isDev && typeof error?.stack === 'string' ? error.stack : undefined
        }
    }

    res.status(status).json(payload)
    res.end()
}

export default async function emailFormContents(req, res) {
    const form = formidable({})

    const {fields, _files} = await parseForm(res, req, form, handleError)
    for (const fieldName in fields) {
        if (!Array.isArray(fields[fieldName])) {
            fields[fieldName] = [fields[fieldName]]
        }
    }

    detailsJson = JSON.stringify(fields, null, 2)

    console.log('detailsJson', detailsJson)

    const emailSubject = `${fields.subjectText}`

    const html = `<strong>${fields.subjectText}</strong><br/><br/>`
    let fieldsHtml = html + '<table>'
    fieldsHtml += `<tr><td><strong>Submitted</strong></td><td>${dateTime}</td></tr>`

    Object.keys(fields)
        .sort()
        .filter(f => f !== 'subjectText')
        .map((key) => {
            fieldsHtml += `<tr><td>${key}</td><td>${fields[key]}</td></tr>`
        })
    fieldsHtml += '</table>'

    try {
        const email = await sendEmail({
            emailConfig: 'content',
            to: raflEmailRecipients,
            subject: `${emailSubject}`,
            text: `${emailSubject} (text)`,
            html: fieldsHtml
        })
        logger.info('Message sent: %s', email.messageId)
    } catch (error) {
        const errorMsg = 'An error occurred sending email'
        logger.error('An error occurred sending email', error)
        handleError(res, errorMsg, error, 500)
        return
    }

    res.status(200).send('Files uploaded successfully')

}

function _slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
    str = str.replace(/[^a-zA-Z0-9\-_+ ]/g, '') // remove any non-alphanumeric characters
        //.replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // remove consecutive hyphens
    return str
}
