import dayjs from 'dayjs'
import {formidable} from 'formidable'
import parseForm from '../../util/parseForm.js'
import {logger} from '../../logger/logger.js'

const log = logger.child({module: 'email-form'})
const maxFields = 30
const maxFieldsSize = 64 * 1024
const maxFieldValues = 5
const maxFieldValueLength = 5_000
const maxSubjectLength = 200
const validFieldName = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{0,63}$/

function requestError(code, message, status = 400) {
    const error = new Error(message)
    error.code = code
    error.status = status
    return error
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
    })[character])
}

function uploadedFileCount(files) {
    return Object.values(files ?? {}).reduce((count, value) => {
        return count + (Array.isArray(value) ? value.length : value ? 1 : 0)
    }, 0)
}

function normalizeFields(rawFields) {
    if (!rawFields || typeof rawFields !== 'object' || Array.isArray(rawFields)) {
        throw requestError('email_form_invalid_fields', 'Form fields are required')
    }

    const entries = Object.entries(rawFields)
    if (entries.length > maxFields) {
        throw requestError('email_form_too_many_fields', `Form cannot contain more than ${maxFields} fields`)
    }

    const fields = {}
    let totalLength = 0
    entries.forEach(([fieldName, rawValue]) => {
        if (!validFieldName.test(fieldName)) {
            throw requestError('email_form_invalid_field_name', `Invalid form field name: ${fieldName}`)
        }

        const values = (Array.isArray(rawValue) ? rawValue : [rawValue])
            .map(value => String(value ?? '').trim())
        if (values.length > maxFieldValues) {
            throw requestError(
                'email_form_too_many_field_values',
                `${fieldName} cannot contain more than ${maxFieldValues} values`
            )
        }
        values.forEach(value => {
            if (value.length > maxFieldValueLength) {
                throw requestError(
                    'email_form_field_too_long',
                    `${fieldName} cannot exceed ${maxFieldValueLength} characters`
                )
            }
            totalLength += value.length
        })
        fields[fieldName] = values
    })

    if (totalLength > maxFieldsSize) {
        throw requestError('email_form_too_large', 'Form field data exceeds the allowed size')
    }
    return fields
}

function validateSubject(fields) {
    const subjectValues = fields.subjectText
    if (!subjectValues || subjectValues.length !== 1 || !subjectValues[0]) {
        throw requestError('email_form_invalid_subject', 'subjectText is required')
    }

    const subject = subjectValues[0]
    if (subject.length > maxSubjectLength || /[\r\n\0]/.test(subject)) {
        throw requestError(
            'email_form_invalid_subject',
            `subjectText must be ${maxSubjectLength} characters or fewer and contain no line breaks`
        )
    }
    return subject
}

function formatFieldValue(values) {
    return values.filter(Boolean).join(', ')
}

function createEmailContent(fields, subject, submittedAt) {
    const bodyFields = Object.keys(fields)
        .sort()
        .filter(fieldName => fieldName !== 'subjectText')
    const rows = bodyFields.map(fieldName => {
        const value = formatFieldValue(fields[fieldName])
        return `<tr><td>${escapeHTML(fieldName)}</td><td>${escapeHTML(value)}</td></tr>`
    }).join('')
    const html = [
        `<strong>${escapeHTML(subject)}</strong><br/><br/>`,
        '<table>',
        `<tr><td><strong>Submitted</strong></td><td>${escapeHTML(submittedAt)}</td></tr>`,
        rows,
        '</table>'
    ].join('')
    const textFields = bodyFields.map(fieldName => {
        return `${fieldName}: ${formatFieldValue(fields[fieldName])}`
    })
    const text = [subject, `Submitted: ${submittedAt}`, ...textFields].join('\n')

    return {html, text}
}

export function createEmailFormHandler({
    runtimeEnvironment = 'local',
    emailSender,
    emailRecipients,
    formFactory = formidable,
    parseFormData = parseForm,
    now = () => new Date()
}) {
    if (typeof emailSender !== 'function') throw new Error('Email-form emailSender is required')
    if (!emailRecipients || (Array.isArray(emailRecipients) && emailRecipients.length === 0)) {
        throw new Error('Email-form emailRecipients are required')
    }

    function handleError(res, message, error, status = 500) {
        if (res.headersSent) {
            log.warn({err: error}, 'Email-form error occurred after headers were sent')
            return
        }

        log.error({err: error, status}, message)
        const isDev = runtimeEnvironment !== 'production'
        return res.status(status).json({
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
        })
    }

    return async function emailFormContents(req, res) {
        let failureMessage = 'Form Parse Error'

        try {
            const form = formFactory({
                maxFields,
                maxFieldsSize,
                maxFiles: 0
            })
            const {fields: rawFields, files} = await parseFormData(res, req, form, handleError)
            if (uploadedFileCount(files) > 0) {
                throw requestError('email_form_files_not_allowed', 'File uploads are not allowed')
            }

            failureMessage = 'Invalid form submission'
            const fields = normalizeFields(rawFields)
            const subject = validateSubject(fields)
            const submittedAt = dayjs(now()).format('YYYY-MM-DD HH:mm')
            const {html, text} = createEmailContent(fields, subject, submittedAt)

            failureMessage = 'An error occurred sending email'
            const email = await emailSender({
                emailConfig: 'content',
                to: emailRecipients,
                subject,
                text,
                html
            })
            log.info({requestId: req.id, messageId: email?.messageId}, 'email form sent')
            return res.status(200).send('Files uploaded successfully')
        } catch (error) {
            if (res.headersSent) return
            const status = typeof error?.status === 'number'
                ? error.status
                : (typeof error?.httpCode === 'number' ? error.httpCode : 500)
            return handleError(res, failureMessage, error, status)
        }
    }
}

export default async function emailFormContents(req, res) {
    const {getDefaultEmailFormHandler} = await import('./emailFormContentsRuntime.js')
    return (await getDefaultEmailFormHandler())(req, res)
}
