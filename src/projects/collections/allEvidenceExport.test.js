import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {runAllEvidenceExport} from './allEvidenceExport.js'

const tempDirs = []

async function makeTempDirs() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-all-evidence-export-'))
    tempDirs.push(root)
    const backupDir = path.join(root, 'backups')
    const publicDataDir = path.join(root, 'public-data')
    await fs.mkdir(backupDir, {recursive: true})
    await fs.writeFile(path.join(backupDir, 'backup.json'), JSON.stringify({
        __collections__: {
            lockcollections: {
                'user-1': {
                    displayName: 'Picker One',
                    blackBeltAwardedAt: '2026-01-01'
                }
            }
        }
    }))
    return {backupDir, publicDataDir}
}

function evidenceDoc(id, data) {
    return {id, data: () => data}
}

function createDb(collections) {
    return {
        collection: vi.fn(name => ({
            get: vi.fn().mockResolvedValue({docs: collections[name]})
        }))
    }
}

afterEach(async () => {
    vi.clearAllMocks()
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runAllEvidenceExport', () => {
    it('writes derived evidence files using injected dependencies', async () => {
        const {backupDir, publicDataDir} = await makeTempDirs()
        const scorecardDoc = evidenceDoc('evidence-1', {
            projectId: 'project-1',
            userId: 'user-1',
            evidenceUrl: 'https://example.com/evidence',
            evidenceCreatedAt: '2026-09-10T12:00:00.000Z',
            modifier: true
        })
        const unclaimedDoc = evidenceDoc('unclaimed-1', {
            projectId: 'project-1',
            tabName: 'Unclaimed Picker',
            evidenceUrl: 'https://example.com/unclaimed',
            evidenceCreatedAt: '2026-09-11T12:00:00.000Z'
        })
        const db = createDb({
            evidence: [scorecardDoc],
            'unclaimed-evidence': [unclaimedDoc]
        })
        const projectEntry = {
            belt: 'Blue Belt',
            makeModels: [{make: 'Example', model: 'Project'}]
        }
        const lockEntry = {
            belt: 'Blue Belt 1',
            makeModels: [{make: 'Example', model: 'Lock'}],
            lockingMechanisms: ['Pin-tumbler']
        }
        const activityLogger = vi.fn().mockResolvedValue(undefined)
        const runDate = new Date(2026, 8, 12, 15, 30)

        const result = await runAllEvidenceExport({
            db,
            backupDir,
            publicDataDir,
            trigger: 'cronjob',
            activityLogger,
            projectDetailsLoader: vi.fn().mockResolvedValue({'project-1': projectEntry}),
            lockDetailsLoader: vi.fn().mockResolvedValue({'project-1': lockEntry}),
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

        const allScorecardEvidence = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'allScorecardEvidence.json'),
            'utf8'
        ))
        expect(allScorecardEvidence).toEqual([
            expect.objectContaining({
                docId: 'evidence-1',
                displayName: 'Picker One',
                blackBelt: true,
                date: '2026-09-10'
            })
        ])

        await expect(fs.access(path.join(publicDataDir, 'allProjects.json')))
            .resolves.toBeUndefined()
        await expect(fs.access(path.join(publicDataDir, 'allUnclaimedEvidence.json')))
            .resolves.toBeUndefined()
        expect(activityLogger).toHaveBeenCalledWith([
            expect.objectContaining({source: 'allEvidenceExport - unclaimed-evidence', count: 1}),
            expect.objectContaining({source: 'allEvidenceExport - scorecardEvidence', count: 1})
        ])
    })
})
