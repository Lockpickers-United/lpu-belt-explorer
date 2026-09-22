import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {createUploadContentHandler} from './uploadContent.js'

const tempDirs = []

async function createUploadRoot() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-content-upload-'))
    tempDirs.push(root)
    return root
}

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

async function parsedUpload(_res, _req, form) {
    const relativeFilename = form.filename('', '', {
        originalFilename: '../../Any_Cutaway_Lock_901b35b2_mg/Any_Cutaway_Lock_901b35b2_lock_mg.jpg'
    })
    const uploadedFile = path.join(form.uploadDir, relativeFilename)
    await fs.mkdir(path.dirname(uploadedFile), {recursive: true})
    await fs.writeFile(uploadedFile, 'image')
    return {
        fields: {
            lockId: ['901b35b2'],
            lockName: ['Any Cutaway Lock'],
            lockFullName: ['Any Cutaway Lock'],
            photoCredit: ['mg'],
            uploadsDir: ['Any_Cutaway_Lock_901b35b2_mg']
        },
        files: {photos: [{filepath: uploadedFile}]}
    }
}

afterEach(async () => {
    vi.clearAllMocks()
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('createUploadContentHandler', () => {
    it('creates a flat archive named for the upload directory', async () => {
        const uploadDir = await createUploadRoot()
        const imageMetadataWriter = vi.fn().mockResolvedValue(undefined)
        let archiveEntries
        const archiveDirectory = vi.fn(async ({sourceDir, destinationFile}) => {
            archiveEntries = await fs.readdir(sourceDir)
            await fs.writeFile(destinationFile, 'zip')
            return {bytes: 3}
        })
        const emailSender = vi.fn(async email => {
            await expect(fs.access(email.attachments.path)).resolves.toBeUndefined()
            return {messageId: 'message-1'}
        })
        const handler = createUploadContentHandler({
            uploadDir,
            emailSender,
            emailRecipients: ['content@example.test'],
            formFactory: vi.fn(options => options),
            parseFormData: parsedUpload,
            imageMetadataWriter,
            archiveDirectory
        })
        const res = createResponse()

        await handler({}, res)

        expect(imageMetadataWriter).toHaveBeenCalledWith(expect.objectContaining({
            caption: 'By: mg',
            title: 'Any Cutaway Lock',
            userComment: '901b35b2'
        }))
        expect(archiveDirectory).toHaveBeenCalledOnce()
        expect(archiveEntries.sort()).toEqual([
            'Any_Cutaway_Lock_901b35b2_lock_mg.jpg',
            'uploadData.json'
        ])
        expect(emailSender).toHaveBeenCalledWith(expect.objectContaining({
            attachments: expect.objectContaining({filename: 'Any_Cutaway_Lock_901b35b2_mg.zip'})
        }))
        expect(res.statusCode).toBe(200)
        expect(res.body).toBe('Files uploaded successfully')
        expect(await fs.readdir(uploadDir)).toEqual([])
    })

    it('cleans up and does not email or return success after metadata failure', async () => {
        const uploadDir = await createUploadRoot()
        const archiveDirectory = vi.fn()
        const emailSender = vi.fn()
        const handler = createUploadContentHandler({
            uploadDir,
            runtimeEnvironment: 'production',
            emailSender,
            emailRecipients: ['content@example.test'],
            formFactory: vi.fn(options => options),
            parseFormData: parsedUpload,
            imageMetadataWriter: vi.fn().mockRejectedValue(new Error('ExifTool failed')),
            archiveDirectory
        })
        const res = createResponse()

        await handler({}, res)

        expect(archiveDirectory).not.toHaveBeenCalled()
        expect(emailSender).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(500)
        expect(res.body.error.stack).toBeUndefined()
        expect(await fs.readdir(uploadDir)).toEqual([])
    })
})
