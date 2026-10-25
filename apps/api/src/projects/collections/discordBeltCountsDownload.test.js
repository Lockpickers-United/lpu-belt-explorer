import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    discordBeltCountsUrl,
    runDiscordBeltCountsDownload
} from './discordBeltCountsDownload.js'

const tempDirs = []

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

async function createPublicDataDir() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-discord-belt-counts-'))
    tempDirs.push(root)
    return path.join(root, 'public-data')
}

describe('runDiscordBeltCountsDownload', () => {
    it('downloads Discord belt counts and publishes them atomically', async () => {
        const publicDataDir = await createPublicDataDir()
        const discordBeltCounts = {'Blue Belt': 9, Total: 20}
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            headers: {get: vi.fn()},
            text: vi.fn().mockResolvedValue(JSON.stringify(discordBeltCounts))
        })

        const result = await runDiscordBeltCountsDownload({publicDataDir, fetchImpl})

        expect(fetchImpl).toHaveBeenCalledWith(discordBeltCountsUrl, {
            signal: expect.any(AbortSignal),
            size: 1024 * 1024
        })
        expect(result).toEqual({
            outputFile: path.join(publicDataDir, 'discordBeltCounts.json'),
            discordBeltCounts
        })
        expect(JSON.parse(await fs.readFile(result.outputFile, 'utf8')))
            .toEqual(discordBeltCounts)
        expect((await fs.readdir(publicDataDir)).some(file => file.includes('.tmp-')))
            .toBe(false)
    })

    it('does not replace an existing file when the download fails', async () => {
        const publicDataDir = await createPublicDataDir()
        await fs.mkdir(publicDataDir, {recursive: true})
        const outputFile = path.join(publicDataDir, 'discordBeltCounts.json')
        await fs.writeFile(outputFile, JSON.stringify({Total: 10}))
        const fetchImpl = vi.fn().mockResolvedValue({ok: false, status: 503})

        await expect(runDiscordBeltCountsDownload({publicDataDir, fetchImpl}))
            .rejects.toThrow('Unable to download Discord belt counts: HTTP 503')
        expect(JSON.parse(await fs.readFile(outputFile, 'utf8'))).toEqual({Total: 10})
    })

    it('rejects a non-object response before writing the output', async () => {
        const publicDataDir = await createPublicDataDir()
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            headers: {get: vi.fn()},
            text: vi.fn().mockResolvedValue('[]')
        })

        await expect(runDiscordBeltCountsDownload({publicDataDir, fetchImpl}))
            .rejects.toThrow('Invalid Discord belt counts response')
        await expect(fs.access(path.join(publicDataDir, 'discordBeltCounts.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
    })
})
