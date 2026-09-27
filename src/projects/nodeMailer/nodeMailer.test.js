import {describe, expect, it} from 'vitest'
import {createTransport} from 'nodemailer'

describe('nodemailer transport contract', () => {
    it('constructs an inert transport and sends the application message shape', async () => {
        const transporter = createTransport({jsonTransport: true})

        const result = await transporter.sendMail({
            from: 'LPU Belts <sender@example.test>',
            to: ['recipient@example.test'],
            subject: 'Test message',
            text: 'Plain text body',
            html: '<p>HTML body</p>',
            attachments: [{filename: 'report.txt', content: 'attachment'}]
        })
        const message = JSON.parse(result.message)

        expect(result.messageId).toMatch(/^<.+@example\.test>$/)
        expect(message).toMatchObject({
            from: {address: 'sender@example.test', name: 'LPU Belts'},
            to: [{address: 'recipient@example.test', name: ''}],
            subject: 'Test message',
            text: 'Plain text body',
            html: '<p>HTML body</p>'
        })
        expect(message.attachments).toEqual([
            expect.objectContaining({filename: 'report.txt', content: 'attachment'})
        ])
    })
})
