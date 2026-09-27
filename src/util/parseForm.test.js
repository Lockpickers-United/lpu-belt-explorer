import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {PassThrough, Readable} from 'node:stream'
import {formidable} from 'formidable'
import {afterEach, describe, expect, it, vi} from 'vitest'
import parseForm from './parseForm.js'

const tempDirs = []

async function createTempDir() {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-formidable-'))
    tempDirs.push(tempDir)
    return tempDir
}

function multipartBody(boundary, parts) {
    const chunks = []
    parts.forEach(({name, value, filename, contentType = 'application/octet-stream'}) => {
        chunks.push(`--${boundary}\r\n`)
        chunks.push(`Content-Disposition: form-data; name="${name}"`)
        if (filename) chunks.push(`; filename="${filename}"`)
        chunks.push('\r\n')
        if (filename) chunks.push(`Content-Type: ${contentType}\r\n`)
        chunks.push('\r\n')
        chunks.push(value)
        chunks.push('\r\n')
    })
    chunks.push(`--${boundary}--\r\n`)
    return Buffer.concat(chunks.map(chunk => Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
}

function requestFor(body, contentType) {
    const req = Readable.from([body])
    req.headers = {
        'content-length': String(body.length),
        'content-type': contentType
    }
    return req
}

async function parseMultipart(options, parts) {
    const boundary = 'lpu-formidable-boundary'
    const body = multipartBody(boundary, parts)
    const form = formidable(options)
    const handleError = vi.fn()
    const promise = parseForm(
        {},
        requestFor(body, `multipart/form-data; boundary=${boundary}`),
        form,
        handleError,
        1,
        2
    )
    return {form, handleError, promise}
}

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(tempDir => {
        return fs.rm(tempDir, {recursive: true, force: true})
    }))
})

describe('parseForm with the real multipart parser', () => {
    it('returns repeated fields and files as arrays and preserves safe filename metadata', async () => {
        const uploadDir = await createTempDir()
        const {promise} = await parseMultipart({uploadDir, keepExtensions: true}, [
            {name: 'tag', value: 'one'},
            {name: 'tag', value: 'two'},
            {name: 'photos', filename: '..\\unsafe\\First Photo.jpg', contentType: 'image/jpeg', value: 'image-one'},
            {name: 'photos', filename: 'second.png', contentType: 'image/png', value: 'image-two'}
        ])

        const {fields, files} = await promise

        expect(fields).toEqual({tag: ['one', 'two']})
        expect(files.photos).toHaveLength(2)
        expect(files.photos.map(file => file.originalFilename).sort()).toEqual(['First Photo.jpg', 'second.png'])
        expect(files.photos.every(file => path.dirname(file.filepath) === uploadDir)).toBe(true)
        expect((await fs.readdir(uploadDir)).sort()).toEqual(
            files.photos.map(file => path.basename(file.filepath)).sort()
        )
    })

    it.each([
        {
            name: 'field count',
            options: {maxFields: 1},
            parts: [{name: 'one', value: '1'}, {name: 'two', value: '2'}],
            code: 1007,
            description: 'Max Fields Exceeded'
        },
        {
            name: 'field size',
            options: {maxFieldsSize: 3},
            parts: [{name: 'field', value: 'four'}],
            code: 1006,
            description: 'Max Fields Size Exceeded'
        },
        {
            name: 'file count',
            options: {maxFiles: 0},
            parts: [{name: 'file', filename: 'one.jpg', value: 'one'}],
            code: 1015,
            description: 'Max File Count Exceeded'
        },
        {
            name: 'individual file size',
            options: {maxFileSize: 3, maxTotalFileSize: 20},
            parts: [{name: 'file', filename: 'one.jpg', value: 'four'}],
            code: 1016,
            description: 'File exceeds size limit of 1 MB'
        },
        {
            name: 'total file size',
            options: {maxFileSize: 20, maxTotalFileSize: 3},
            parts: [{name: 'file', filename: 'one.jpg', value: 'four'}],
            code: 1009,
            description: 'Total upload exceeds size limit of 2 MB'
        }
    ])('maps and cleans up a $name limit failure', async ({options, parts, code, description}) => {
        const uploadDir = await createTempDir()
        const {handleError, promise} = await parseMultipart({...options, uploadDir}, parts)

        await expect(promise).rejects.toMatchObject({code, httpCode: 413})
        expect(handleError).toHaveBeenCalledWith(
            {},
            description,
            expect.objectContaining({code}),
            413
        )
        await vi.waitFor(async () => {
            expect(await fs.readdir(uploadDir)).toEqual([])
        })
    })

    it.each([
        {
            name: 'a missing boundary',
            contentType: 'multipart/form-data',
            body: Buffer.from('body'),
            code: 1013,
            description: 'Missing Multipart Boundary'
        },
        {
            name: 'a truncated multipart body',
            contentType: 'multipart/form-data; boundary=broken',
            body: Buffer.from('--broken\r\nContent-Disposition: form-data; name="field"\r\n\r\nvalue'),
            code: 1012,
            description: 'Malformed Multipart'
        }
    ])('maps $name to its stable error response', async ({contentType, body, code, description}) => {
        const form = formidable()
        const handleError = vi.fn()

        await expect(parseForm({}, requestFor(body, contentType), form, handleError)).rejects.toMatchObject({
            code,
            httpCode: 400
        })
        expect(handleError).toHaveBeenCalledWith(
            {},
            description,
            expect.objectContaining({code}),
            400
        )
    })

    it('maps an interrupted request and removes its partial file', async () => {
        const uploadDir = await createTempDir()
        const boundary = 'interrupted-boundary'
        const req = new PassThrough()
        req.headers = {
            'content-type': `multipart/form-data; boundary=${boundary}`,
            'transfer-encoding': 'chunked'
        }
        const form = formidable({uploadDir})
        const handleError = vi.fn()
        const promise = parseForm({}, req, form, handleError)

        req.write([
            `--${boundary}`,
            'Content-Disposition: form-data; name="file"; filename="partial.jpg"',
            'Content-Type: image/jpeg',
            '',
            'partial data'
        ].join('\r\n'))
        setImmediate(() => req.emit('aborted'))

        await expect(promise).rejects.toMatchObject({code: 1002})
        expect(handleError).toHaveBeenCalledWith(
            {},
            'Aborted',
            expect.objectContaining({code: 1002}),
            500
        )
        await vi.waitFor(async () => {
            expect(await fs.readdir(uploadDir)).toEqual([])
        })
    })
})
