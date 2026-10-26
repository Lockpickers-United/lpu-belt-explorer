import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {runLeaderboardStatsProcess} from './leaderboardStatsProcess.js'

const tempDirs = []

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runLeaderboardStatsProcess', () => {
    it('builds leaderboard data from the current backup and writes it atomically', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-leaderboard-stats-'))
        tempDirs.push(root)
        const backupDir = path.join(root, 'backups')
        const publicDataDir = path.join(root, 'public-data')
        await fs.mkdir(backupDir, {recursive: true})
        await fs.writeFile(path.join(backupDir, 'backup.json'), JSON.stringify({
            __collections__: {
                lockcollections: {
                    'user-1': {
                        displayName: 'First User',
                        own: ['lock-1', 'lock-1'],
                        picked: ['lock-2'],
                        recordedLocks: ['lock-1', 'lock-2', 'lock-2'],
                        projects: ['project-1'],
                        blackBeltAwardedAt: {_seconds: 100},
                        danLevel: 2,
                        danPoints: 7,
                        blackBeltCount: 3,
                        privacyAnonymous: true
                    },
                    'user-2': {}
                }
            }
        }))
        const itemDetailsLoader = vi.fn().mockResolvedValue({
            'lock-1': {fullBelt: 'White Belt'},
            'lock-2': {fullBelt: 'Blue Belt'},
            'project-1': {fullBelt: 'Black Belt'}
        })
        const runDate = new Date(2026, 8, 12, 12, 34)

        const result = await runLeaderboardStatsProcess({
            backupDir,
            publicDataDir,
            itemDetailsLoader,
            now: () => runDate
        })

        expect(itemDetailsLoader).toHaveBeenCalledOnce()
        expect(result.profileCount).toBe(2)
        expect(result.leaderboardData).toEqual({
            data: [
                {
                    displayName: 'First User',
                    id: 'user-1',
                    own: 2,
                    picked: 1,
                    recordedLocks: 3,
                    projects: 1,
                    locksCollection: 2,
                    uniqueLocks: 2,
                    beltCounts: {
                        'White Belt': 1,
                        'Blue Belt': 1,
                        'Black Belt': 1,
                        Project: 1
                    },
                    danLevel: 2,
                    danPoints: 7,
                    blackBeltCount: 3,
                    blackBeltAwardedAt: 100,
                    privacyAnonymous: true
                },
                {
                    displayName: 'no display name',
                    id: 'user-2',
                    blackBeltAwardedAt: 0
                }
            ],
            metadata: {updatedDateTime: '2026-09-12 12:34'}
        })

        const output = JSON.parse(await fs.readFile(result.outputFile, 'utf8'))
        expect(output).toEqual(result.leaderboardData)
        expect((await fs.readdir(publicDataDir)).some(file => file.includes('.tmp-'))).toBe(false)
    })

    it('rejects an invalid backup before loading item details', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-leaderboard-stats-'))
        tempDirs.push(root)
        const backupDir = path.join(root, 'backups')
        await fs.mkdir(backupDir, {recursive: true})
        await fs.writeFile(path.join(backupDir, 'backup.json'), '{}')
        const itemDetailsLoader = vi.fn()

        await expect(runLeaderboardStatsProcess({
            backupDir,
            publicDataDir: path.join(root, 'public-data'),
            itemDetailsLoader
        })).rejects.toThrow(`Invalid lockcollections backup: ${path.join(backupDir, 'backup.json')}`)
        expect(itemDetailsLoader).not.toHaveBeenCalled()
    })
})
