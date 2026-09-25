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
                    }
                }
            }
        })),
        fs.writeFile(path.join(exportDir, 'evidence.json'), JSON.stringify({
            metadata: {},
            data: [{
                docId: 'evidence-1',
                projectId: 'project-1',
                userId: 'user-1',
                evidenceUrl: 'https://example.com/evidence',
                evidenceCreatedAt: {_seconds: 1789041600, _nanoseconds: 0},
                modifier: true
            }]
        })),
        fs.writeFile(unclaimedEvidenceFile, JSON.stringify([{
            docId: 'unclaimed-1',
            projectId: 'project-1',
            tabName: 'Unclaimed Picker',
            evidenceUrl: 'https://example.com/unclaimed',
            evidenceCreatedAt: '2026-09-11T12:00:00.000Z'
        }]))
    ])
    return {backupDir, exportDir, publicDataDir, unclaimedEvidenceFile}
}

afterEach(async () => {
    vi.clearAllMocks()
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runAllEvidenceExport', () => {
    it('writes site evidence files from local exports without archived outputs', async () => {
        const {backupDir, exportDir, publicDataDir, unclaimedEvidenceFile} = await makeTempDirs()
        const projectEntry = {
            belt: 'Blue Belt',
            makeModels: [{make: 'Example', model: 'Project'}]
        }
        const lockEntry = {
            belt: 'Blue Belt 1',
            makeModels: [{make: 'Example', model: 'Lock'}],
            lockingMechanisms: ['Pin-tumbler']
        }
        const runDate = new Date(2026, 8, 12, 15, 30)

        const result = await runAllEvidenceExport({
            backupDir,
            exportDir,
            publicDataDir,
            trigger: 'cronjob',
            projectDetailsLoader: vi.fn().mockResolvedValue({'project-1': projectEntry}),
            lockDetailsLoader: vi.fn().mockResolvedValue({'project-1': lockEntry}),
            unclaimedEvidenceFile,
            now: () => runDate
        })

        expect(result.metadata.updatedDateTime).toBe('2026-09-12 15:30')
        expect(result.projects).toHaveLength(2)
        expect(result.modifiers).toHaveLength(1)

        const pickStats = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'pickStats.json'),
            'utf8'
        ))
        expect(pickStats.byLock).toEqual({'project-1': 1})
        expect(pickStats.lockDetails).toEqual([
            expect.objectContaining({id: 'project-1', pickCount: 1})
        ])

        const allProjects = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'allProjects.json'),
            'utf8'
        ))
        expect(allProjects.projects).toEqual([
            expect.objectContaining({docId: 'evidence-1', date: '2026-09-10'}),
            expect.objectContaining({docId: 'unclaimed-1', date: '2026-09-11'})
        ])
        await expect(fs.access(path.join(publicDataDir, 'allScorecardEvidence.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
        await expect(fs.access(path.join(publicDataDir, 'allUnclaimedEvidence.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
    })
})
