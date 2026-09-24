import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import express from 'express'
import {formidable} from 'formidable'
import request from 'supertest'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {createEmailFormHandler} from './emailFormContents/emailFormContents.js'
import {createRequestLockHandlers} from './requestLock/requestLock.js'
import {createUploadContentHandler} from './uploadContent/uploadContent.js'

vi.mock('./sendToDiscord/sendToDiscord.js', () => ({default: vi.fn()}))

const tempDirs = []

async function createTempDir(prefix) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix))
    tempDirs.push(tempDir)
    return tempDir
}

function createApp(handler) {
    const app = express()
    app.post('/', async (req, res, next) => {
        try {
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    })
    return app
}

function createEmailHandler(overrides = {}) {
    return createEmailFormHandler({
        runtimeEnvironment: 'production',
        emailSender: vi.fn().mockResolvedValue({messageId: 'message-1'}),
        emailRecipients: ['content@example.test'],
        now: () => new Date('2026-09-23T12:00:00.000Z'),
        ...overrides
    })
}

afterEach(async () => {
    vi.clearAllMocks()
    await Promise.all(tempDirs.splice(0).map(tempDir => {
        return fs.rm(tempDir, {recursive: true, force: true})
    }))
})

describe('multipart endpoint contracts', () => {
    it('parses repeated fields through the email-form endpoint', async () => {
        const emailSender = vi.fn().mockResolvedValue({messageId: 'message-1'})
        const app = createApp(createEmailHandler({emailSender}))

        const response = await request(app)
            .post('/')
            .field('subjectText', 'New lock submission')
            .field('displayName', 'Picker One')
            .field('interests', 'pin tumblers')
            .field('interests', 'disc detainers')

        expect(response.status).toBe(200)
        expect(emailSender).toHaveBeenCalledWith(expect.objectContaining({
            subject: 'New lock submission',
            text: expect.stringContaining('interests: pin tumblers, disc detainers')
        }))
    })

    it('parses and cleans up multiple files through the upload endpoint', async () => {
        const uploadDir = await createTempDir('lpu-upload-endpoint-')
        let archiveEntries
        let formOptions
        const archiveDirectory = vi.fn(async ({sourceDir, destinationFile}) => {
            archiveEntries = (await fs.readdir(sourceDir)).sort()
            await fs.writeFile(destinationFile, 'zip')
            return {bytes: 3}
        })
        const emailSender = vi.fn().mockResolvedValue({messageId: 'message-1'})
        const handler = createUploadContentHandler({
            uploadDir,
            emailSender,
            emailRecipients: ['content@example.test'],
            formFactory: options => {
                formOptions = options
                return formidable(options)
            },
            imageMetadataWriter: vi.fn().mockResolvedValue(undefined),
            archiveDirectory
        })

        const response = await request(createApp(handler))
            .post('/')
            .field('lockId', 'lock-1')
            .field('lockName', 'Example Lock')
            .field('lockFullName', 'Example Lock Full Name')
            .field('photoCredit', 'Picker One')
            .field('uploadsDir', 'Example_Lock')
            .attach('photos', Buffer.from('image-one'), {
                filename: 'First Photo.jpg',
                contentType: 'image/jpeg'
            })
            .attach('photos', Buffer.from('image-two'), {
                filename: 'second.png',
                contentType: 'image/png'
            })

        expect(response.status).toBe(200)
        expect(response.text).toBe('Files uploaded successfully')
        expect(formOptions).toMatchObject({
            uploadDir: expect.stringMatching(/^.+\/content-upload-/),
            maxFileSize: 15 * 1024 * 1024,
            maxTotalFileSize: 60 * 1024 * 1024
        })
        expect(archiveEntries).toEqual(['First-Photo.jpg', 'second.png', 'uploadData.json'])
        expect(emailSender).toHaveBeenCalledWith(expect.objectContaining({
            attachments: expect.objectContaining({filename: 'Example_Lock.zip'})
        }))
        expect(await fs.readdir(uploadDir)).toEqual([])
    })

    it('parses an authenticated image upload through the request-lock endpoint', async () => {
        const uploadDir = await createTempDir('lpu-request-lock-endpoint-')
        const ref = {
            set: vi.fn().mockResolvedValue(undefined),
            update: vi.fn(),
            get: vi.fn()
        }
        let formOptions
        const handlers = createRequestLockHandlers({
            db: {collection: vi.fn(() => ({doc: vi.fn(() => ref)}))},
            auth: {verifyIdToken: vi.fn().mockResolvedValue({user_id: 'user-1'})},
            uploadDir,
            publicImageBaseUrl: 'https://example.test/requestedLocks',
            emailSender: vi.fn().mockResolvedValue({messageId: 'message-1'}),
            emailRecipients: ['content@example.test'],
            activityLogger: vi.fn().mockResolvedValue(undefined),
            formFactory: options => {
                formOptions = options
                return formidable(options)
            },
            thumbnailCreator: vi.fn(async ({inputFile, width}) => `${inputFile}-${width}.jpg`),
            imageMetadataWriter: vi.fn().mockResolvedValue(undefined),
            now: () => new Date('2026-09-23T12:00:00.000Z')
        })

        const response = await request(createApp(handlers.requestLock))
            .post('/')
            .set('Authorization', 'Bearer valid-token')
            .field('id', 'request-1')
            .field('make', 'Example')
            .field('model', 'Lock')
            .field('displayName', 'Picker One')
            .field('discordUsername', 'picker-one')
            .field('userBelt', 'Blue')
            .attach('files', Buffer.from('image'), {
                filename: '..\\unsafe\\Photo One.jpg',
                contentType: 'image/jpeg'
            })

        expect(response.status).toBe(200)
        expect(formOptions).toMatchObject({
            uploadDir,
            maxFileSize: 10 * 1024 * 1024,
            maxTotalFileSize: 50 * 1024 * 1024
        })
        expect(ref.set).toHaveBeenCalledWith(expect.objectContaining({
            id: 'request-1',
            media: [expect.objectContaining({
                fullUrl: 'https://example.test/requestedLocks/Photo-One.jpg',
                sequenceId: 1
            })]
        }))
        expect(await fs.readdir(uploadDir)).toEqual(['Photo-One.jpg'])
    })

    it.each([
        {
            name: 'field-count overflow',
            build(requestBuilder) {
                requestBuilder.field('subjectText', 'Subject')
                for (let index = 0; index < 30; index += 1) {
                    requestBuilder.field(`field${index}`, String(index))
                }
                return requestBuilder
            },
            code: 1007,
            message: 'Max Fields Exceeded'
        },
        {
            name: 'field-size overflow',
            build(requestBuilder) {
                return requestBuilder
                    .field('subjectText', 'Subject')
                    .field('message', 'x'.repeat((64 * 1024) + 1))
            },
            code: 1006,
            message: 'Max Fields Size Exceeded'
        }
    ])('retains the stable response for an email-form $name', async ({build, code, message}) => {
        const emailSender = vi.fn()
        const response = await build(request(createApp(createEmailHandler({emailSender}))).post('/'))

        expect(response.status).toBe(413)
        expect(response.body.error).toMatchObject({
            message,
            code,
            details: {formidableCode: code}
        })
        expect(emailSender).not.toHaveBeenCalled()
    })

    it('rejects and cleans up a file submitted to the email-form endpoint', async () => {
        const uploadDir = await createTempDir('lpu-email-form-endpoint-')
        const emailSender = vi.fn()
        const handler = createEmailHandler({
            emailSender,
            formFactory: options => formidable({...options, uploadDir})
        })

        const response = await request(createApp(handler))
            .post('/')
            .field('subjectText', 'Subject')
            .attach('attachment', Buffer.from('not allowed'), {
                filename: 'attachment.txt',
                contentType: 'text/plain'
            })

        expect(response.status).toBe(413)
        expect(response.body.error).toMatchObject({
            message: 'Max File Count Exceeded',
            code: 1015,
            details: {formidableCode: 1015}
        })
        expect(emailSender).not.toHaveBeenCalled()
        await vi.waitFor(async () => {
            expect(await fs.readdir(uploadDir)).toEqual([])
        })
    })

    it('retains the stable response for malformed multipart data', async () => {
        const emailSender = vi.fn()
        const response = await request(createApp(createEmailHandler({emailSender})))
            .post('/')
            .set('Content-Type', 'multipart/form-data; boundary=broken')
            .send('--broken\r\nContent-Disposition: form-data; name="subjectText"\r\n\r\nSubject')

        expect(response.status).toBe(400)
        expect(response.body.error).toMatchObject({
            message: 'Malformed Multipart',
            code: 1012,
            details: {formidableCode: 1012}
        })
        expect(emailSender).not.toHaveBeenCalled()
    })
})
