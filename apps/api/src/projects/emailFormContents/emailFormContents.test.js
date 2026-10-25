import {describe, expect, it, vi} from 'vitest'
import {createEmailFormHandler} from './emailFormContents.js'

function createResponse() {
    const res = {headersSent: false, statusCode: null, body: null}
    res.status = vi.fn(status => {
        res.statusCode = status
        return res
    })
    res.json = vi.fn(body => {
        res.body = body
        res.headersSent = true
        return res
    })
    res.send = vi.fn(body => {
        res.body = body
        res.headersSent = true
        return res
    })
    return res
}

function createHandler({
    emailSender = vi.fn().mockResolvedValue({messageId: 'message-1'}),
    parseFormData,
    runtimeEnvironment = 'development',
    now = () => new Date(2026, 8, 12, 20, 15),
    formFactory = vi.fn(options => options)
} = {}) {
    return {
        emailSender,
        formFactory,
        handler: createEmailFormHandler({
            runtimeEnvironment,
            emailSender,
            emailRecipients: ['rafl@example.test'],
            formFactory,
            parseFormData,
            now
        })
    }
}

describe('createEmailFormHandler', () => {
    it('validates, escapes, and awaits a request-local email submission', async () => {
        const parseFormData = vi.fn().mockResolvedValue({
            fields: {
                subjectText: ['Pot <One> submitted'],
                displayName: ['Alice & Bob'],
                potContents: ['Pins <script>alert("x")</script>']
            },
            files: {}
        })
        const {handler, emailSender, formFactory} = createHandler({parseFormData})
        const res = createResponse()

        await handler({id: 'request-1'}, res)

        expect(formFactory).toHaveBeenCalledWith({
            maxFields: 30,
            maxFieldsSize: 64 * 1024,
            maxFiles: 0
        })
        expect(emailSender).toHaveBeenCalledWith(expect.objectContaining({
            emailConfig: 'content',
            to: ['rafl@example.test'],
            subject: 'Pot <One> submitted',
            text: expect.stringContaining('Submitted: 2026-09-12 20:15'),
            html: expect.stringContaining('Alice &amp; Bob')
        }))
        const [{html}] = emailSender.mock.calls.map(([email]) => email)
        expect(html).toContain('Pot &lt;One&gt; submitted')
        expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
        expect(html).not.toContain('<script>')
        expect(res.statusCode).toBe(200)
        expect(res.body).toBe('Files uploaded successfully')
    })

    it('keeps concurrent request subjects and timestamps isolated', async () => {
        const parseFormData = vi.fn(async (_res, req) => ({
            fields: {subjectText: [req.subject], displayName: [req.displayName]},
            files: {}
        }))
        const now = vi.fn()
            .mockReturnValueOnce(new Date(2026, 0, 1, 10, 0))
            .mockReturnValueOnce(new Date(2026, 1, 2, 11, 30))
        const {handler, emailSender} = createHandler({parseFormData, now})

        await Promise.all([
            handler({id: 'one', subject: 'First', displayName: 'Alice'}, createResponse()),
            handler({id: 'two', subject: 'Second', displayName: 'Bob'}, createResponse())
        ])

        expect(emailSender).toHaveBeenCalledTimes(2)
        expect(emailSender.mock.calls[0][0]).toMatchObject({subject: 'First'})
        expect(emailSender.mock.calls[0][0].html).toContain('2026-01-01 10:00')
        expect(emailSender.mock.calls[0][0].html).not.toContain('Bob')
        expect(emailSender.mock.calls[1][0]).toMatchObject({subject: 'Second'})
        expect(emailSender.mock.calls[1][0].html).toContain('2026-02-02 11:30')
        expect(emailSender.mock.calls[1][0].html).not.toContain('Alice')
    })

    it('rejects an invalid subject without sending email', async () => {
        const parseFormData = vi.fn().mockResolvedValue({
            fields: {subjectText: ['first\nBcc: attacker@example.test']},
            files: {}
        })
        const {handler, emailSender} = createHandler({parseFormData})
        const res = createResponse()

        await handler({id: 'request-1'}, res)

        expect(emailSender).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(400)
        expect(res.body.error.code).toBe('email_form_invalid_subject')
    })

    it('rejects file uploads without sending email', async () => {
        const parseFormData = vi.fn().mockResolvedValue({
            fields: {subjectText: ['Pot submitted']},
            files: {attachment: [{filepath: '/tmp/unexpected'}]}
        })
        const {handler, emailSender} = createHandler({parseFormData})
        const res = createResponse()

        await handler({id: 'request-1'}, res)

        expect(emailSender).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(400)
        expect(res.body.error.code).toBe('email_form_files_not_allowed')
    })

    it('waits for email failure and omits stack details in production', async () => {
        const parseFormData = vi.fn().mockResolvedValue({
            fields: {subjectText: ['Pot submitted']},
            files: {}
        })
        const emailSender = vi.fn().mockRejectedValue(new Error('SMTP unavailable'))
        const {handler} = createHandler({
            parseFormData,
            emailSender,
            runtimeEnvironment: 'production'
        })
        const res = createResponse()

        await handler({id: 'request-1'}, res)

        expect(emailSender).toHaveBeenCalledOnce()
        expect(res.statusCode).toBe(500)
        expect(res.body.error.message).toBe('An error occurred sending email')
        expect(res.body.error.stack).toBeUndefined()
    })
})
