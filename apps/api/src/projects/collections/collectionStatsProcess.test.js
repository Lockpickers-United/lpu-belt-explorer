import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {runCollectionStatsProcess} from './collectionStatsProcess.js'

const tempDirs = []

function dailyStats({
    totalProfiles,
    listUsers,
    totalSaves,
    importUsers,
    blackBelts = {}
}) {
    return {
        allUsers: {
            totalProfiles,
            listUsers,
            totalSaves,
            lockSaves: totalSaves - 1,
            importSummary: {
                totalAwards: importUsers + 1,
                importUsers,
                awardUsers: importUsers
            },
            listStats: {
                own: {userCount: listUsers - 1, totalSaves: totalSaves - 2}
            }
        },
        blackBeltOnly: {
            totalProfiles: Object.keys(blackBelts).length,
            listUsers: Object.keys(blackBelts).length,
            totalSaves: Object.keys(blackBelts).length * 10,
            blackBelts
        }
    }
}

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runCollectionStatsProcess', () => {
    it('sorts dated inputs, calculates daily changes, and writes the summary atomically', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-collection-stats-'))
        tempDirs.push(root)
        const dailyDir = path.join(root, 'daily')
        const publicDataDir = path.join(root, 'public-data')
        await fs.mkdir(dailyDir, {recursive: true})

        await fs.writeFile(
            path.join(dailyDir, 'collectionStats_2026-09-11.json'),
            JSON.stringify(dailyStats({
                totalProfiles: 12,
                listUsers: 9,
                totalSaves: 110,
                importUsers: 5,
                blackBelts: {
                    'user-1': {displayName: 'First User'},
                    'user-2': {displayName: 'Second User'}
                }
            }))
        )
        await fs.writeFile(
            path.join(dailyDir, 'collectionStats_2026-09-10.json'),
            JSON.stringify(dailyStats({
                totalProfiles: 10,
                listUsers: 8,
                totalSaves: 100,
                importUsers: 3,
                blackBelts: {'user-1': {displayName: 'First User'}}
            }))
        )
        await fs.writeFile(path.join(dailyDir, 'collectionStatsCurrent.json'), '{}')

        const runDate = new Date('2026-09-12T12:00:00.000Z')
        const result = await runCollectionStatsProcess({
            dailyDir,
            publicDataDir,
            now: () => runDate
        })

        expect(result.dayCount).toBe(2)
        expect(result.collectionStatsDaily.metadata.updatedDateTime).toBe(runDate.toISOString())
        expect(result.collectionStatsDaily.dayData.map(day => day.date)).toEqual([
            '2026-09-10',
            '2026-09-11'
        ])
        expect(result.collectionStatsDaily.dayData[0].allUsers).toMatchObject({
            newProfiles: 10,
            newListUsers: 8,
            newImportUsers: 3
        })
        expect(result.collectionStatsDaily.dayData[1].allUsers).toMatchObject({
            newProfiles: 2,
            newListUsers: 1,
            newImportUsers: 2,
            listStats: [{listName: 'own', userCount: 8, totalSaves: 108}]
        })
        expect(result.collectionStatsDaily.blackBelts).toEqual({
            'user-1': {displayName: 'First User', acquired: '2026-09-10'},
            'user-2': {displayName: 'Second User', acquired: '2026-09-11'}
        })

        const output = JSON.parse(await fs.readFile(result.outputFile, 'utf8'))
        expect(output).toEqual(result.collectionStatsDaily)
        expect((await fs.readdir(publicDataDir)).some(file => file.includes('.tmp-'))).toBe(false)
    })
})
