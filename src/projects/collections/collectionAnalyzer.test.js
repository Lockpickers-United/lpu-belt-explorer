import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {runCollectionAnalysis} from './collectionAnalyzer.js'

const tempDirs = []

async function writeBackup(backupDir, date, lockcollections) {
    const archiveDir = path.join(backupDir, 'archive')
    await fs.mkdir(archiveDir, {recursive: true})
    await fs.writeFile(
        path.join(archiveDir, `backup_${date}.json`),
        JSON.stringify({__collections__: {lockcollections}})
    )
}

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runCollectionAnalysis', () => {
    it('processes dated backups in order and publishes the latest analysis atomically', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-collection-analysis-'))
        tempDirs.push(root)
        const backupDir = path.join(root, 'backups')
        const dailyDir = path.join(root, 'daily')
        const apiDir = path.join(root, 'api-data')
        const publicDataDir = path.join(root, 'public-data')

        await writeBackup(backupDir, '2026-09-10', {
            'user-1': {
                displayName: 'First User',
                own: ['lock-1'],
                blackBeltAwardedAt: {_seconds: 1}
            }
        })
        await writeBackup(backupDir, '2026-09-11', {
            'user-1': {
                displayName: 'First User',
                own: ['lock-1'],
                blackBeltAwardedAt: {_seconds: 1}
            },
            'user-2': {
                displayName: 'Second User',
                wishlist: ['lock-1']
            }
        })

        const itemDetailsLoader = vi.fn().mockResolvedValue({
            'lock-1': {
                type: 'lock',
                belt: 'White',
                shortName: 'Test Lock',
                itemName: 'Test Lock'
            }
        })
        const runDate = new Date('2026-09-12T12:00:00.000Z')

        const result = await runCollectionAnalysis({
            backupDir,
            dailyDir,
            apiDir,
            publicDataDir,
            itemDetailsLoader,
            now: () => runDate
        })

        expect(result).toEqual({
            processedDates: ['2026-09-10', '2026-09-11'],
            latestDate: '2026-09-11'
        })
        expect(itemDetailsLoader).toHaveBeenCalledOnce()
        await expect(fs.access(path.join(dailyDir, 'collectionStats_2026-09-10.json')))
            .resolves.toBeUndefined()
        await expect(fs.access(path.join(dailyDir, 'collectionStats_2026-09-11.json')))
            .resolves.toBeUndefined()

        const apiStats = JSON.parse(await fs.readFile(
            path.join(apiDir, 'collectionStatsByIdFull.json'),
            'utf8'
        ))
        expect(apiStats).toEqual({
            metadata: {
                updatedDateTime: runDate.toISOString(),
                source: 'generated-summary'
            },
            data: {
                locks: [{
                    id: 'lock-1',
                    name: 'Test Lock',
                    totalSaves: 2,
                    ownCount: 1,
                    wishlistCount: 1
                }]
            }
        })

        const currentStats = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'collectionStatsCurrent.json'),
            'utf8'
        ))
        expect(currentStats.metadata.updatedDateTime).toBe(runDate.toISOString())
        expect(currentStats.allUsers.totalProfiles).toBe(2)
        expect(currentStats.blackBeltOnly.totalProfiles).toBe(1)

        const outputFiles = await Promise.all([
            fs.readdir(dailyDir),
            fs.readdir(apiDir),
            fs.readdir(publicDataDir)
        ])
        expect(outputFiles.flat().some(file => file.includes('.tmp-'))).toBe(false)
    })

    it('skips archived dates that already have daily output', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-collection-analysis-'))
        tempDirs.push(root)
        const backupDir = path.join(root, 'backups')
        const dailyDir = path.join(root, 'daily')
        await writeBackup(backupDir, '2026-09-10', {})
        await fs.mkdir(dailyDir, {recursive: true})
        await fs.writeFile(path.join(dailyDir, 'collectionStats_2026-09-10.json'), '{}')
        const itemDetailsLoader = vi.fn().mockResolvedValue({})

        const result = await runCollectionAnalysis({
            backupDir,
            dailyDir,
            apiDir: path.join(root, 'api-data'),
            publicDataDir: path.join(root, 'public-data'),
            itemDetailsLoader,
            now: () => new Date('2026-09-12T12:00:00.000Z')
        })

        expect(result).toEqual({processedDates: [], latestDate: null})
        expect(itemDetailsLoader).not.toHaveBeenCalled()
    })
})
