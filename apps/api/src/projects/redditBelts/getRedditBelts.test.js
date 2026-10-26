import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    createGetRedditBeltsHandler,
    runRedditBeltsRefresh,
    transformRedditFlairs
} from './getRedditBelts.js'

const tempDirs = []
const flairs = [
    {user: 'alice', flair_text: 'Blue Belt', flair_css_class: 'blue'},
    {user: 'bob', flair_text: 'Legendary Black Belt', flair_css_class: 'black'},
    {user: 'charlie', flair_text: 'No rank', flair_css_class: null}
]

async function createOutputDir() {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-reddit-belts-'))
    tempDirs.push(outputDir)
    return outputDir
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

describe('transformRedditFlairs', () => {
    it('builds user flair and normalized belt-count data', () => {
        expect(transformRedditFlairs(flairs)).toEqual({
            beltCounts: {'Blue Belt': 1, 'Black Belt': 1},
            redditUserFlairs: {
                alice: 'Blue Belt',
                bob: 'Legendary Black Belt',
                charlie: null
            }
        })
    })

    it('rejects malformed upstream entries', () => {
        expect(() => transformRedditFlairs([{user: 'alice', flair_text: null}]))
            .toThrowError(expect.objectContaining({code: 'reddit_flairs_invalid', status: 502}))
    })
})

describe('runRedditBeltsRefresh', () => {
    it('runs the configured script and publishes both JSON files', async () => {
        const outputDir = await createOutputDir()
        const executeFile = vi.fn().mockResolvedValue({stdout: JSON.stringify(flairs), stderr: ''})

        const result = await runRedditBeltsRefresh({
            scriptPath: '/srv/lpu/fetch_reddit_flairs.py',
            credentialsPath: '/srv/lpu/keys_deprecated/reddit-keys.json',
            outputDir,
            pythonExecutable: '/usr/bin/python3',
            timeoutMs: 20_000,
            maxOutputBytes: 50_000,
            executeFile,
            jobLogger: {info: vi.fn()}
        })

        expect(executeFile).toHaveBeenCalledWith(
            '/usr/bin/python3',
            ['/srv/lpu/fetch_reddit_flairs.py', '/srv/lpu/keys_deprecated/reddit-keys.json'],
            {encoding: 'utf8', timeout: 20_000, maxBuffer: 50_000}
        )
        expect(result).toEqual({beltCounts: {'Blue Belt': 1, 'Black Belt': 1}, flairCount: 3})
        await expect(fs.readFile(path.join(outputDir, 'redditBeltCounts.json'), 'utf8'))
            .resolves.toBe(JSON.stringify(result.beltCounts, null, 2))
        await expect(fs.readFile(path.join(outputDir, 'redditUserFlairs.json'), 'utf8'))
            .resolves.toBe(JSON.stringify({
                alice: 'Blue Belt',
                bob: 'Legendary Black Belt',
                charlie: null
            }, null, 2))
        expect((await fs.readdir(outputDir)).filter(file => file.includes('.tmp-'))).toEqual([])
    })

    it('preserves existing outputs when staging either new file fails', async () => {
        const outputDir = await createOutputDir()
        const existingFiles = {
            'redditBeltCounts.json': 'old counts',
            'redditUserFlairs.json': 'old flairs'
        }
        await Promise.all(Object.entries(existingFiles).map(([filename, content]) => {
            return fs.writeFile(path.join(outputDir, filename), content)
        }))
        const fileSystem = {
            mkdir: fs.mkdir,
            rm: fs.rm,
            rename: fs.rename,
            async writeFile(filename, ...args) {
                if (filename.includes('redditBeltCounts.json.tmp-')) throw new Error('disk full')
                return fs.writeFile(filename, ...args)
            }
        }

        await expect(runRedditBeltsRefresh({
            scriptPath: '/srv/lpu/fetch_reddit_flairs.py',
            credentialsPath: '/srv/lpu/keys_deprecated/reddit-keys.json',
            outputDir,
            executeFile: vi.fn().mockResolvedValue({stdout: JSON.stringify(flairs)}),
            fileSystem,
            jobLogger: {info: vi.fn()}
        })).rejects.toThrow('disk full')

        for (const [filename, content] of Object.entries(existingFiles)) {
            await expect(fs.readFile(path.join(outputDir, filename), 'utf8')).resolves.toBe(content)
        }
        expect((await fs.readdir(outputDir)).filter(file => file.includes('.tmp-'))).toEqual([])
    })

    it('wraps script failures without exposing process output', async () => {
        const outputDir = await createOutputDir()
        const cause = Object.assign(new Error('secret stderr'), {stderr: 'secret stderr'})

        await expect(runRedditBeltsRefresh({
            scriptPath: '/srv/lpu/fetch_reddit_flairs.py',
            credentialsPath: '/srv/lpu/keys_deprecated/reddit-keys.json',
            outputDir,
            executeFile: vi.fn().mockRejectedValue(cause),
            jobLogger: {info: vi.fn()}
        })).rejects.toMatchObject({
            code: 'reddit_flairs_fetch_failed',
            message: 'Unable to fetch Reddit flair data',
            status: 502
        })
    })
})

describe('createGetRedditBeltsHandler', () => {
    it('shares one in-flight refresh between overlapping requests', async () => {
        let resolveRun
        const pendingRun = new Promise(resolve => {
            resolveRun = resolve
        })
        const runRefresh = vi.fn().mockReturnValue(pendingRun)
        const handler = createGetRedditBeltsHandler({runRefresh})
        const firstResponse = createResponse()
        const secondResponse = createResponse()
        const firstRequest = handler({id: 'first'}, firstResponse)
        const secondRequest = handler({id: 'second'}, secondResponse)

        await vi.waitFor(() => expect(runRefresh).toHaveBeenCalledOnce())
        resolveRun({beltCounts: {'Blue Belt': 1}, flairCount: 1})
        await Promise.all([firstRequest, secondRequest])

        expect(firstResponse.body.data).toEqual({'Blue Belt': 1})
        expect(secondResponse.body.data).toEqual({'Blue Belt': 1})
    })

    it('omits stack details from production errors', async () => {
        const error = Object.assign(new Error('Reddit unavailable'), {
            code: 'reddit_flairs_fetch_failed',
            status: 502
        })
        const handler = createGetRedditBeltsHandler({
            runRefresh: vi.fn().mockRejectedValue(error),
            runtimeEnvironment: 'production'
        })
        const res = createResponse()

        await handler({id: 'request-1'}, res)

        expect(res.statusCode).toBe(502)
        expect(res.body).toEqual({
            status: 502,
            code: 'reddit_flairs_fetch_failed',
            message: 'Reddit unavailable',
            stack: undefined
        })
    })
})
