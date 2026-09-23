import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {loadLockData, runLockStats} from './lockStats.js'

const tempDirs = []

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runLockStats', () => {
    it('builds lock and photo statistics and publishes them atomically', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-lock-stats-'))
        tempDirs.push(root)
        const publicDataDir = path.join(root, 'public-data')
        const lockDataLoader = vi.fn().mockResolvedValue([
            {
                belt: 'Green',
                lockingMechanisms: ['Pin tumbler'],
                media: [{}],
                views: 100
            },
            {
                belt: 'Unranked',
                lockingMechanisms: ['Disc detainer', 'Slider'],
                views: 50
            },
            {belt: 'Blue 2', media: [], views: 0}
        ])
        const itemDetailsLoader = vi.fn().mockResolvedValue({
            'lock-1': {
                media: [
                    {fullSizeUrl: 'https://images.example/1', title: 'By: Alice'}
                ]
            },
            'lock-2': {
                media: [
                    {fullSizeUrl: 'https://images.example/2', title: 'By: Bob'},
                    {fullSizeUrl: 'https://images.example/3', title: 'By: Alice'}
                ]
            },
            'lock-3': {}
        })
        const runDate = new Date(2026, 8, 22, 12, 34)

        const result = await runLockStats({
            publicDataDir,
            lockDataLoader,
            itemDetailsLoader,
            now: () => runDate
        })

        expect(lockDataLoader).toHaveBeenCalledOnce()
        expect(itemDetailsLoader).toHaveBeenCalledOnce()
        expect(result.lockCount).toBe(3)
        expect(result.lockStats).toEqual({
            lockCounts: {
                description: 'Locks',
                data: [
                    {value: 2, label: 'Ranked'},
                    {value: 3, label: 'All'},
                    {value: 1, label: 'Unranked'}
                ]
            },
            locksByBelt: [
                {belt: 'Green', count: 1, value: 1 / 3, id: 'Green'},
                {belt: 'Unranked', count: 1, value: 1 / 3, id: 'Unranked'},
                {belt: 'Blue', count: 1, value: 1 / 3, id: 'Blue'}
            ],
            lockingMechanisms: [
                {label: 'Multiple', value: 1, id: 'multiple'},
                {label: 'Pin tumbler', value: 1, id: 'pin-tumbler'}
            ],
            lockingMechanismsByBelt: {
                Green: [{label: 'Pin tumbler', value: 1, id: 'pin-tumbler'}],
                Unranked: [{label: 'Multiple', value: 1, id: 'multiple'}]
            },
            photoStats: {
                photoSegments: [
                    {segment: 'Top 250 locks', count: 250, media: 2, coverage: '0%'},
                    {segment: 'Ranked locks', count: 2, media: 2, coverage: '100%'},
                    {segment: 'All locks', count: 3, media: 2, coverage: '66%'}
                ],
                uniqueImages: 3,
                contributors: 2,
                topPhotographers: [
                    {contributor: 'Alice', images: 2},
                    {contributor: 'Bob', images: 1}
                ]
            },
            metadata: {updatedDateTime: '2026-09-22 12:34'}
        })
        expect(JSON.parse(await fs.readFile(result.outputFile, 'utf8')))
            .toEqual(result.lockStats)
        expect((await fs.readdir(publicDataDir)).some(file => file.includes('.tmp-'))).toBe(false)
    })

    it('rejects invalid lock data before loading item details or writing output', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-lock-stats-'))
        tempDirs.push(root)
        const publicDataDir = path.join(root, 'public-data')
        const itemDetailsLoader = vi.fn()

        await expect(runLockStats({
            publicDataDir,
            lockDataLoader: vi.fn().mockResolvedValue({}),
            itemDetailsLoader
        })).rejects.toThrow('Invalid lock data')
        expect(itemDetailsLoader).not.toHaveBeenCalled()
        await expect(fs.access(publicDataDir)).rejects.toMatchObject({code: 'ENOENT'})
    })
})

describe('loadLockData', () => {
    it('reports upstream HTTP failures', async () => {
        await expect(loadLockData(vi.fn().mockResolvedValue({ok: false, status: 503})))
            .rejects.toThrow('Unable to load lock data: HTTP 503')
    })
})
