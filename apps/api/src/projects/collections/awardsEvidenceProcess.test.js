import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {runAllEvidenceExport} from './awardsEvidenceProcess.js'

const tempDirs = []

async function makeTempDirs() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-all-evidence-export-'))
    tempDirs.push(root)
    const backupDir = path.join(root, 'backups')
    const exportDir = path.join(root, 'exports')
    const publicDataDir = path.join(root, 'public-data')
    const apiDir = path.join(root, 'api-data')
    const unclaimedEvidenceFile = path.join(root, 'allUnclaimedEvidence.json')
    await Promise.all([
        fs.mkdir(backupDir, {recursive: true}),
        fs.mkdir(exportDir, {recursive: true})
    ])
    await Promise.all([
        fs.writeFile(path.join(backupDir, 'backup.json'), JSON.stringify({
            __collections__: {
                lockcollections: {
                    'user-1': {
                        displayName: 'Picker One',
                        blackBeltAwardedAt: '2026-01-01'
                    },
                    'user-2': {
                        displayName: 'Picker Two'
                    }
                }
            }
        })),
        fs.writeFile(path.join(exportDir, 'evidence.json'), JSON.stringify({
            metadata: {},
            data: [
                {
                    docId: 'evidence-1',
                    projectId: 'project-1',
                    userId: 'user-1',
                    evidenceUrl: 'https://www.youtube.com/watch?v=evidence',
                    evidenceCreatedAt: {_seconds: 1789041600, _nanoseconds: 0},
                    modifier: true
                },
                {
                    docId: 'evidence-2',
                    projectId: 'project-1',
                    userId: 'user-1',
                    evidenceUrl: 'https://example.com/photo',
                    evidenceCreatedAt: {_seconds: 1789041600, _nanoseconds: 0}
                },
                {
                    docId: 'evidence-1',
                    projectId: 'project-1',
                    userId: 'user-1',
                    evidenceUrl: 'https://www.youtube.com/watch?v=evidence',
                    evidenceCreatedAt: {_seconds: 1789041600, _nanoseconds: 0},
                    modifier: true
                },
                {
                    docId: 'evidence-3',
                    projectId: 'project-1',
                    userId: 'user-1',
                    evidenceUrl: 'https://www.youtube.com/watch?v=evidence',
                    evidenceCreatedAt: {_seconds: 1789041600, _nanoseconds: 0}
                },
                {
                    docId: 'evidence-4',
                    projectId: 'project-1',
                    userId: 'user-2',
                    evidenceUrl: 'https://www.youtube.com/watch?v=evidence',
                    evidenceCreatedAt: {_seconds: 1789041600, _nanoseconds: 0}
                }
            ]
        })),
        fs.writeFile(unclaimedEvidenceFile, JSON.stringify([{
            docId: 'unclaimed-1',
            projectId: 'project-1',
            tabName: 'Unclaimed Picker',
            evidenceUrl: 'https://example.com/unclaimed',
            evidenceCreatedAt: '2026-09-11T12:00:00.000Z'
        }]))
    ])
    return {backupDir, exportDir, publicDataDir, apiDir, unclaimedEvidenceFile}
}

afterEach(async () => {
    vi.clearAllMocks()
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runAllEvidenceExport', () => {
    it('writes deduplicated site evidence files from local exports without archived outputs', async () => {
        const {
            backupDir,
            exportDir,
            publicDataDir,
            apiDir,
            unclaimedEvidenceFile
        } = await makeTempDirs()
        const projectEntry = {
            belt: 'Blue Belt',
            makeModels: [{make: 'Example', model: 'Project'}]
        }
        const lockEntry = {
            id: 'project-1',
            belt: 'Blue Belt 1',
            makeModels: [{make: 'Example', model: 'Lock'}],
            lockingMechanisms: ['Pin-tumbler']
        }
        const runDate = new Date(2026, 8, 12, 15, 30)

        const result = await runAllEvidenceExport({
            backupDir,
            exportDir,
            publicDataDir,
            apiDir,
            trigger: 'cronjob',
            projectDetailsLoader: vi.fn().mockResolvedValue({'project-1': projectEntry}),
            lockDetailsLoader: vi.fn().mockResolvedValue({'project-1': lockEntry}),
            unclaimedEvidenceFile,
            now: () => runDate
        })

        expect(result.metadata.updatedDateTime).toBe('2026-09-12 15:30')
        expect(result.projects).toHaveLength(3)
        expect(result.modifiers).toHaveLength(1)

        const pickStats = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'pickStats.json'),
            'utf8'
        ))
        expect(pickStats.byLock).toEqual({'project-1': 4})
        expect(pickStats.lockDetails).toEqual([
            expect.objectContaining({id: 'project-1', pickCount: 4})
        ])

        const allProjects = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'allProjects.json'),
            'utf8'
        ))
        expect(allProjects.projects).toEqual([
            expect.objectContaining({docId: 'evidence-1', date: '2026-09-10'}),
            expect.objectContaining({docId: 'evidence-2', date: '2026-09-10'}),
            expect.objectContaining({docId: 'unclaimed-1', date: '2026-09-11'})
        ])

        const lockVideos = JSON.parse(await fs.readFile(
            path.join(apiDir, 'lockVideos.json'),
            'utf8'
        ))
        expect(lockVideos).toEqual({
            metadata: {updatedDateTime: '2026-09-12 15:30'},
            lockVideos: {
                'project-1': [
                    {
                        userId: 'user-1',
                        pickerName: 'Picker One',
                        pickerIsBlackBelt: true,
                        url: 'https://www.youtube.com/watch?v=evidence',
                        date: '2026-09-10'
                    },
                    {
                        userId: 'user-2',
                        pickerName: 'Picker Two',
                        pickerIsBlackBelt: false,
                        url: 'https://www.youtube.com/watch?v=evidence',
                        date: '2026-09-10'
                    }
                ]
            }
        })

        await expect(fs.access(path.join(publicDataDir, 'allScorecardEvidence.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
        await expect(fs.access(path.join(publicDataDir, 'allUnclaimedEvidence.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
    })
})
