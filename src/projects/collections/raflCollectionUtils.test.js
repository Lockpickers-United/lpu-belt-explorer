import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {runRaflCollectionUtils} from './raflCollectionUtils.js'

const tempDirs = []

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runRaflCollectionUtils', () => {
    it('aggregates watchlists from the current backup and writes the result atomically', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-rafl-collection-'))
        tempDirs.push(root)
        const backupDir = path.join(root, 'backups')
        const publicDataDir = path.join(root, 'public-data')
        await fs.mkdir(backupDir, {recursive: true})
        await fs.writeFile(path.join(backupDir, 'backup.json'), JSON.stringify({
            __collections__: {
                lockcollections: {
                    'user-1': {raffleWatchlist: ['pot-1', 'pot-2', 'pot-2']},
                    'user-2': {raffleWatchlist: []},
                    'user-3': {raffleWatchlist: ['pot-2']},
                    'user-4': {}
                }
            }
        }))

        const result = await runRaflCollectionUtils({backupDir, publicDataDir})

        expect(result.watchlistUserCount).toBe(2)
        expect(result.raflCollectionDetails).toEqual({
            potWatches: {'pot-1': 1, 'pot-2': 3},
            allPotWatches: 4,
            potWatchMax: 3,
            potWatchCounts: {'1': 1, '3': 1},
            raffleWatchlistUsers: 2,
            raffleWatchlistAverage: 2
        })
        const output = JSON.parse(await fs.readFile(result.outputFile, 'utf8'))
        expect(output).toEqual(result.raflCollectionDetails)
        expect((await fs.readdir(publicDataDir)).some(file => file.includes('.tmp-'))).toBe(false)
    })

    it('rejects an invalid backup without writing output', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-rafl-collection-'))
        tempDirs.push(root)
        const backupDir = path.join(root, 'backups')
        const publicDataDir = path.join(root, 'public-data')
        await fs.mkdir(backupDir, {recursive: true})
        await fs.writeFile(path.join(backupDir, 'backup.json'), '{}')

        await expect(runRaflCollectionUtils({backupDir, publicDataDir}))
            .rejects.toThrow(`Invalid lockcollections backup: ${path.join(backupDir, 'backup.json')}`)
        await expect(fs.access(publicDataDir)).rejects.toMatchObject({code: 'ENOENT'})
    })
})
