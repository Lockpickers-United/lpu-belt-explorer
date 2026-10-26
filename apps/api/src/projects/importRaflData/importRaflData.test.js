import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {createImportRaflDataHandler, runRaflDataImport} from './importRaflData.js'

const tempDirs = []

const fixtures = {
    RAFL: [{
        'Unique ID': '2026-001',
        'Year': '2026',
        'Pot Number': '1',
        'Contributed By': 'Alice, Bob',
        'Title': 'Test Pot',
        'Winner Count': '2',
        'Display Name': 'Test Pot Display',
        'Description': 'Description',
        'Description Continued': '',
        'Pot Contents': 'Locks',
        'Tags': 'tag one, tag two',
        'Keywords': 'test',
        'Country': 'US, CA',
        'Shipping Info Text': 'Included',
        'Split Shipping': 'TRUE',
        'Shipping Type': 'International',
        'Ships To US': 'Yes',
        'Date Added': '2026-09-12'
    }],
    'RAFL Media': [{
        'Unique ID': '2026-001',
        'Sequence ID': '1',
        'Title': 'Front',
        'Subtitle': '',
        'Thumbnail URL': 'https://example.test/thumb.jpg',
        'Full URL': 'https://example.test/full.jpg',
        'Subtitle URL': '',
        'Full Image Direct URL': 'https://example.test/original.jpg'
    }],
    'RAFL Charities': [{
        'Unique ID': 'charity-1',
        'Charity Name': 'Test Charity',
        'URL': 'https://example.test/charity',
        'Total Donations 2024': '$1,250'
    }]
}

async function createOutputDir() {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-rafl-preview-'))
    tempDirs.push(outputDir)
    return outputDir
}

function createFetch() {
    return vi.fn(async url => {
        const tab = new URL(url).searchParams.get('sheet')
        return {
            ok: true,
            status: 200,
            text: async () => tab
        }
    })
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
    return res
}

afterEach(async () => {
    vi.clearAllMocks()
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runRaflDataImport', () => {
    it('validates and publishes all preview files with the version marker last', async () => {
        const outputDir = await createOutputDir()
        const fetchImpl = createFetch()
        const parseCsv = vi.fn(csv => fixtures[csv])
        const renameOrder = []
        const fileSystem = {
            mkdir: fs.mkdir,
            writeFile: fs.writeFile,
            rm: fs.rm,
            async rename(source, destination) {
                renameOrder.push(path.basename(destination))
                return fs.rename(source, destination)
            }
        }

        const result = await runRaflDataImport({
            sheetId: 'test-sheet-id-12345',
            outputDir,
            fetchImpl,
            parseCsv,
            fileSystem,
            now: () => new Date('2026-09-12T20:00:00.000Z'),
            jobLogger: {info: vi.fn()}
        })

        expect(result).toEqual({status: 'All Good!'})
        expect(fetchImpl).toHaveBeenCalledTimes(3)
        expect(renameOrder).toEqual([
            'raflPreviewPots.json',
            'raflPreviewCharities.json',
            'raflPreviewVersion.json'
        ])
        const pots = JSON.parse(await fs.readFile(path.join(outputDir, 'raflPreviewPots.json'), 'utf8'))
        const charities = JSON.parse(await fs.readFile(path.join(outputDir, 'raflPreviewCharities.json'), 'utf8'))
        const version = JSON.parse(await fs.readFile(path.join(outputDir, 'raflPreviewVersion.json'), 'utf8'))
        expect(pots[0]).toMatchObject({
            id: '2026-001',
            winnerCount: 2,
            contributedBy: ['Alice', 'Bob'],
            media: [expect.objectContaining({title: 'Front'})]
        })
        expect(charities[0]).toMatchObject({name: 'Test Charity', donations2024: 1250})
        expect(version).toEqual({version: '2026-09-12T20:00:00.000Z'})
        expect((await fs.readdir(outputDir)).filter(file => file.includes('.tmp-'))).toEqual([])
    })

    it('does not publish when sheet validation fails', async () => {
        const outputDir = await createOutputDir()
        const writeFile = vi.fn()
        const invalidSchema = {
            validate: () => ({error: {details: [{message: 'invalid RAFL data'}]}})
        }
        const validSchema = {validate: () => ({})}

        const result = await runRaflDataImport({
            sheetId: 'test-sheet-id-12345',
            outputDir,
            fetchImpl: createFetch(),
            parseCsv: csv => fixtures[csv],
            schemas: {rafl: invalidSchema, media: validSchema, charities: validSchema},
            fileSystem: {mkdir: vi.fn(), writeFile},
            jobLogger: {info: vi.fn()}
        })

        expect(result.status).toBe('Errors')
        expect(result.errors).toEqual([
            {sheet: 'RAFL', 'Invalid data found in sheet': [{message: 'invalid RAFL data'}]}
        ])
        expect(writeFile).not.toHaveBeenCalled()
    })

    it('preserves existing outputs when staging any new file fails', async () => {
        const outputDir = await createOutputDir()
        const existingFiles = {
            'raflPreviewPots.json': 'old pots',
            'raflPreviewCharities.json': 'old charities',
            'raflPreviewVersion.json': 'old version'
        }
        await Promise.all(Object.entries(existingFiles).map(([filename, content]) => {
            return fs.writeFile(path.join(outputDir, filename), content)
        }))
        const fileSystem = {
            mkdir: fs.mkdir,
            rm: fs.rm,
            rename: fs.rename,
            async writeFile(filename, ...args) {
                if (filename.includes('raflPreviewCharities.json.tmp-')) {
                    throw new Error('disk full')
                }
                return fs.writeFile(filename, ...args)
            }
        }

        await expect(runRaflDataImport({
            sheetId: 'test-sheet-id-12345',
            outputDir,
            fetchImpl: createFetch(),
            parseCsv: csv => fixtures[csv],
            fileSystem,
            jobLogger: {info: vi.fn()}
        })).rejects.toThrow('disk full')

        for (const [filename, content] of Object.entries(existingFiles)) {
            await expect(fs.readFile(path.join(outputDir, filename), 'utf8')).resolves.toBe(content)
        }
        expect((await fs.readdir(outputDir)).filter(file => file.includes('.tmp-'))).toEqual([])
    })
})

describe('createImportRaflDataHandler', () => {
    it('shares one in-flight refresh and starts a new one after completion', async () => {
        let resolveRun
        const firstRun = new Promise(resolve => {
            resolveRun = resolve
        })
        const runImport = vi.fn()
            .mockReturnValueOnce(firstRun)
            .mockResolvedValueOnce({status: 'All Good!'})
        const handler = createImportRaflDataHandler({runImport})
        const firstResponse = createResponse()
        const secondResponse = createResponse()
        const firstRequest = handler({id: 'first'}, firstResponse)
        const secondRequest = handler({id: 'second'}, secondResponse)

        await vi.waitFor(() => expect(runImport).toHaveBeenCalledOnce())
        resolveRun({status: 'All Good!'})
        await Promise.all([firstRequest, secondRequest])
        await handler({id: 'third'}, createResponse())

        expect(runImport).toHaveBeenCalledTimes(2)
        expect(firstResponse.body).toEqual({status: 'All Good!'})
        expect(secondResponse.body).toEqual({status: 'All Good!'})
    })

    it('returns a production-safe operational error', async () => {
        const error = Object.assign(new Error('Google unavailable'), {
            code: 'rafl_preview_fetch_failed',
            status: 502
        })
        const handler = createImportRaflDataHandler({
            runImport: vi.fn().mockRejectedValue(error),
            runtimeEnvironment: 'production'
        })
        const res = createResponse()

        await handler({id: 'request-1'}, res)

        expect(res.statusCode).toBe(502)
        expect(res.body).toEqual({
            status: 'Errors',
            errors: [{
                code: 'rafl_preview_fetch_failed',
                message: 'Google unavailable',
                stack: undefined
            }]
        })
    })
})
