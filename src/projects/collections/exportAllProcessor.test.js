import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {runExportAllProcessor} from './exportAllProcessor.js'

const tempDirs = []

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

async function createInputDirectories() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-export-all-'))
    tempDirs.push(root)
    const exportDir = path.join(root, 'exports')
    const publicDataDir = path.join(root, 'public-data')
    await Promise.all([
        fs.mkdir(exportDir, {recursive: true}),
        fs.mkdir(publicDataDir, {recursive: true})
    ])
    return {exportDir, publicDataDir}
}

async function writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data))
}

describe('runExportAllProcessor', () => {
    it('builds scorecard statistics and publishes them atomically', async () => {
        const {exportDir, publicDataDir} = await createInputDirectories()
        await Promise.all([
            writeJson(path.join(exportDir, 'lockcollections.json'), {
                data: [
                    {
                        docId: 'user-1',
                        awards: ['award-blue', 'missing-award'],
                        recordedLocks: ['lock-1', 'lock-1', 'lock-2']
                    },
                    {
                        docId: 'user-2',
                        awards: ['award-black'],
                        recordedLocks: ['lock-1'],
                        danLevel: 3
                    },
                    {docId: 'user-3'}
                ]
            }),
            writeJson(path.join(exportDir, 'awards.json'), {
                data: [
                    {
                        userId: 'user-1',
                        awardId: 'award-blue',
                        awardUrl: 'https://discord.com/example'
                    },
                    {
                        userId: 'user-2',
                        awardId: 'award-black',
                        awardUrl: 'https://reddit.com/example'
                    }
                ]
            }),
            writeJson(path.join(publicDataDir, 'redditBeltCounts.json'), {
                'Blue Belt': 8,
                Total: 18
            }),
            writeJson(path.join(publicDataDir, 'discordBeltCounts.json'), {
                'Blue Belt': 9,
                Total: 20
            })
        ])
        const itemDetailsLoader = vi.fn().mockResolvedValue({
            'award-blue': {awardType: 'belt', rank: 5},
            'award-black': {awardType: 'belt', rank: 9},
            'lock-1': {belt: 'Green', lockingMechanisms: ['Pin tumbler']},
            'lock-2': {belt: 'Orange', lockingMechanisms: ['Wafer', 'Lever']}
        })
        const runDate = new Date('2026-09-22T12:34:56.000Z')

        const result = await runExportAllProcessor({
            exportDir,
            publicDataDir,
            itemDetailsLoader,
            now: () => runDate
        })

        expect(itemDetailsLoader).toHaveBeenCalledOnce()
        expect(result.scorecardStats).toEqual({
            userCounts: {
                totalUsers: 3,
                scorecardUsers: 2,
                beltedUsers: 2,
                belts: {Blue: 1, Black: 1},
                dans: {'3': 1}
            },
            lockCountsByUserBelt: {
                'lock-1': {scorecardPicks: {Blue: 1, 'All Belts': 2, Black: 1}},
                'lock-2': {scorecardPicks: {Blue: 1, 'All Belts': 1}}
            },
            byBeltByMechanism: {
                Blue: {'Pin tumbler': 1, Multiple: 1},
                Black: {'Pin tumbler': 1}
            },
            byBelt: {Green: 2, Orange: 1},
            byMechanism: {'Pin tumbler': 2, Multiple: 1},
            awardSources: {discord: 1, reddit: 1},
            platformBeltCounts: {
                discord: {Blue: 9, Total: 20},
                reddit: {Blue: 8, Total: 18}
            },
            metadata: {date: runDate.toISOString()}
        })
        expect(JSON.parse(await fs.readFile(result.outputFile, 'utf8')))
            .toEqual(result.scorecardStats)
        expect((await fs.readdir(publicDataDir)).some(file => file.includes('.tmp-'))).toBe(false)
    })

    it('rejects invalid exports before loading remote item details or writing output', async () => {
        const {exportDir, publicDataDir} = await createInputDirectories()
        await Promise.all([
            writeJson(path.join(exportDir, 'lockcollections.json'), {data: {}}),
            writeJson(path.join(exportDir, 'awards.json'), {data: []}),
            writeJson(path.join(publicDataDir, 'redditBeltCounts.json'), {}),
            writeJson(path.join(publicDataDir, 'discordBeltCounts.json'), {})
        ])
        const itemDetailsLoader = vi.fn()

        await expect(runExportAllProcessor({
            exportDir,
            publicDataDir,
            itemDetailsLoader
        })).rejects.toThrow(
            `Invalid lockcollections export: ${path.join(exportDir, 'lockcollections.json')}`
        )
        expect(itemDetailsLoader).not.toHaveBeenCalled()
        await expect(fs.access(path.join(publicDataDir, 'scorecardStats.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
    })
})
