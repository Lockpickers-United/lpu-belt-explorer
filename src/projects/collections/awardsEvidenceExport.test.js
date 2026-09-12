import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {Timestamp} from 'firebase-admin/firestore'
import {afterEach, describe, expect, it, vi} from 'vitest'
import dayjs from 'dayjs'
import {runAwardsEvidenceExport} from './awardsEvidenceExport.js'

const tempDirs = []

async function makeTempDirs() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-awards-evidence-export-'))
    tempDirs.push(root)
    const exportDir = path.join(root, 'exports')
    const backupDir = path.join(root, 'backups')
    const publicDataDir = path.join(root, 'public-data')
    await Promise.all([
        fs.mkdir(exportDir, {recursive: true}),
        fs.mkdir(backupDir, {recursive: true}),
        fs.mkdir(publicDataDir, {recursive: true})
    ])
    await Promise.all([
        fs.writeFile(path.join(exportDir, 'awards.json'), JSON.stringify({metadata: {}, data: []})),
        fs.writeFile(path.join(exportDir, 'evidence.json'), JSON.stringify({metadata: {}, data: []})),
        fs.writeFile(path.join(backupDir, 'backup.json'), JSON.stringify({
            __collections__: {lockcollections: {}}
        })),
        fs.writeFile(path.join(publicDataDir, 'unclaimedEvidence.json'), '[]')
    ])
    return {root, exportDir, backupDir, publicDataDir}
}

function createIncrementalDb({changes = {}, sourceDocs = {}} = {}) {
    const sourceGet = vi.fn(() => {
        throw new Error('A full collection bootstrap was not expected')
    })
    const collection = vi.fn(name => {
        if (name.endsWith('ChangeIndex')) {
            const get = vi.fn().mockResolvedValue({docs: changes[name] ?? []})
            return {
                where: vi.fn(() => ({orderBy: vi.fn(() => ({get}))}))
            }
        }
        return {
            doc: id => ({collection: name, id}),
            get: sourceGet
        }
    })
    const getAll = vi.fn(async (...refs) => refs.map(ref => sourceDocs[`${ref.collection}/${ref.id}`]))
    return {db: {collection, getAll}, getAll, sourceGet}
}

const emptyItemDetailLoaders = {
    lockDetails: vi.fn().mockResolvedValue({}),
    safelockDetails: vi.fn().mockResolvedValue({}),
    projectDetails: vi.fn().mockResolvedValue({}),
    awardDetails: vi.fn().mockResolvedValue({})
}

afterEach(async () => {
    vi.clearAllMocks()
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runAwardsEvidenceExport', () => {
    it('regenerates derived outputs without full source reads when there are no changes', async () => {
        const {exportDir, backupDir, publicDataDir} = await makeTempDirs()
        const {db, getAll, sourceGet} = createIncrementalDb()
        const activityLogger = vi.fn().mockResolvedValue(undefined)

        const runDate = new Date('2026-09-11T15:30:00.000Z')
        await runAwardsEvidenceExport({
            db,
            publicDataDir,
            backupDir,
            exportDir,
            lookbackMs: 300_000,
            trigger: 'cronjob',
            activityLogger,
            itemDetailLoaders: emptyItemDetailLoaders,
            now: () => runDate
        })

        expect(sourceGet).not.toHaveBeenCalled()
        expect(getAll).not.toHaveBeenCalled()

        const recent = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'recentAwardsEvidence.json'),
            'utf8'
        ))
        const allProjects = JSON.parse(await fs.readFile(
            path.join(publicDataDir, 'allProjectsEvidence.json'),
            'utf8'
        ))
        const expectedUpdatedDateTime = dayjs(runDate).format('YYYY-MM-DD HH:mm')
        expect(recent).toEqual({metadata: {updatedDateTime: expectedUpdatedDateTime}})
        expect(allProjects).toEqual({metadata: {updatedDateTime: expectedUpdatedDateTime}})
        expect(activityLogger).toHaveBeenCalledWith([
            expect.objectContaining({source: 'awardsEvidenceExport_awardsChangeIndex', count: 0}),
            expect.objectContaining({source: 'awardsEvidenceExport_awards', count: 0}),
            expect.objectContaining({source: 'awardsEvidenceExport_evidenceChangeIndex', count: 0}),
            expect.objectContaining({source: 'awardsEvidenceExport_evidence', count: 0})
        ])
    })

    it('does not advance state when a dependent output cannot be written', async () => {
        const {exportDir, backupDir, publicDataDir} = await makeTempDirs()
        await fs.mkdir(path.join(publicDataDir, 'allProjectsEvidence.json'))

        const changedAt = Timestamp.fromDate(new Date('2026-09-10T12:00:00.000Z'))
        const changes = {
            awardsChangeIndex: [{
                id: 'award-1',
                data: () => ({docId: 'award-1', changedAt})
            }]
        }
        const sourceDocs = {
            'awards/award-1': {
                id: 'award-1',
                exists: true,
                data: () => ({awardId: 'award-type-1', userId: 'user-1'})
            }
        }
        const {db} = createIncrementalDb({changes, sourceDocs})
        const activityLogger = vi.fn().mockResolvedValue(undefined)

        await expect(runAwardsEvidenceExport({
            db,
            publicDataDir,
            backupDir,
            exportDir,
            lookbackMs: 300_000,
            trigger: 'cronjob',
            activityLogger,
            itemDetailLoaders: emptyItemDetailLoaders,
            now: () => new Date('2026-09-11T15:30:00.000Z')
        })).rejects.toThrow()

        await expect(fs.access(path.join(exportDir, 'awards.exportState.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
        expect(activityLogger).not.toHaveBeenCalled()
    })
})
