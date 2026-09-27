import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {Timestamp} from 'firebase-admin/firestore'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {runCollectionsExport} from './collectionsExport.js'

const tempDirs = []

async function makeTempDirs() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-collections-export-'))
    tempDirs.push(root)
    const exportDir = path.join(root, 'exports')
    const backupDir = path.join(root, 'backups')
    await fs.mkdir(exportDir, {recursive: true})
    return {root, exportDir, backupDir}
}

function createIncrementalDb(changedAt) {
    const changeDocs = [
        {id: 'user-1', data: () => ({docId: 'user-1', changedAt})},
        {id: 'user-2', data: () => ({docId: 'user-2', changedAt})}
    ]
    const sourceDocs = {
        'user-1': {id: 'user-1', exists: true, data: () => ({displayName: 'Updated'})},
        'user-2': {id: 'user-2', exists: false, data: () => undefined}
    }
    const getChanges = vi.fn().mockResolvedValue({docs: changeDocs})
    const orderBy = vi.fn(() => ({get: getChanges}))
    const where = vi.fn(() => ({orderBy}))
    const sourceGet = vi.fn(() => {
        throw new Error('A full collection bootstrap was not expected')
    })
    const collection = vi.fn(name => {
        if (name === 'lockcollectionsChangeIndex') return {where}
        if (name === 'lockcollections') {
            return {
                doc: id => ({collection: name, id}),
                get: sourceGet
            }
        }
        throw new Error(`Unexpected collection ${name}`)
    })
    const getAll = vi.fn(async (...refs) => refs.map(ref => sourceDocs[ref.id]))

    return {
        db: {collection, getAll},
        getAll,
        getChanges,
        sourceGet
    }
}

function createFullExportDb(changedAt) {
    const fullDocs = [
        {id: 'user-1', data: () => ({displayName: 'Full snapshot'})},
        {id: 'user-2', data: () => ({displayName: 'Removed during export'})}
    ]
    const changeDocs = [
        {id: 'user-1', data: () => ({docId: 'user-1', changedAt})},
        {id: 'user-2', data: () => ({docId: 'user-2', changedAt})}
    ]
    const sourceDocs = {
        'user-1': {id: 'user-1', exists: true, data: () => ({displayName: 'Reconciled'})},
        'user-2': {id: 'user-2', exists: false, data: () => undefined}
    }
    const getChanges = vi.fn().mockResolvedValue({docs: changeDocs})
    const orderBy = vi.fn(() => ({get: getChanges}))
    const where = vi.fn(() => ({orderBy}))
    const sourceGet = vi.fn().mockResolvedValue({docs: fullDocs})
    const collection = vi.fn(name => {
        if (name === 'lockcollectionsChangeIndex') return {where}
        if (name === 'lockcollections') {
            return {
                doc: id => ({collection: name, id}),
                get: sourceGet
            }
        }
        throw new Error(`Unexpected collection ${name}`)
    })
    const getAll = vi.fn(async (...refs) => refs.map(ref => sourceDocs[ref.id]))

    return {
        db: {collection, getAll},
        getAll,
        sourceGet,
        where
    }
}

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('runCollectionsExport', () => {
    it('merges changed documents, removes deleted documents, and advances state after output', async () => {
        const {exportDir, backupDir} = await makeTempDirs()
        await fs.writeFile(path.join(exportDir, 'lockcollections.json'), JSON.stringify({
            metadata: {},
            data: [
                {docId: 'user-1', displayName: 'Original'},
                {docId: 'user-2', displayName: 'Deleted'}
            ]
        }))

        const changedAt = Timestamp.fromDate(new Date('2026-09-10T12:00:00.000Z'))
        const {db, getAll, sourceGet} = createIncrementalDb(changedAt)
        const activityLogger = vi.fn().mockResolvedValue(undefined)
        const now = () => new Date('2026-09-11T15:30:00.000Z')

        const fullDb = await runCollectionsExport({
            db,
            backupDir,
            exportDir,
            lookbackMs: 300_000,
            trigger: 'cronjob',
            activityLogger,
            now
        })

        expect(sourceGet).not.toHaveBeenCalled()
        expect(getAll).toHaveBeenCalledOnce()
        expect(fullDb.__collections__.lockcollections).toEqual({
            'user-1': {displayName: 'Updated'}
        })

        const rawExport = JSON.parse(await fs.readFile(
            path.join(exportDir, 'lockcollections.json'),
            'utf8'
        ))
        expect(rawExport.data).toEqual([{docId: 'user-1', displayName: 'Updated'}])
        expect(rawExport.metadata).toMatchObject({
            bootstrapped: false,
            changedDocCount: 2,
            deletedDocCount: 1,
            changeIndexReadCount: 2,
            lockcollectionReadCount: 2
        })

        const state = JSON.parse(await fs.readFile(
            path.join(exportDir, 'lockcollections.exportState.json'),
            'utf8'
        ))
        expect(state.lastSuccessfulExportChangedAt.iso).toBe('2026-09-10T12:00:00.000Z')
        expect(state.lastExportedAt).toBe('2026-09-11T15:30:00.000Z')
        expect(state.processedChangeKeys).toHaveLength(2)

        await expect(fs.access(path.join(backupDir, 'backup.json'))).resolves.toBeUndefined()
        await expect(fs.access(path.join(
            backupDir,
            'archive',
            'backup_2026-09-11.json'
        ))).resolves.toBeUndefined()
        expect(activityLogger).toHaveBeenCalledWith([
            expect.objectContaining({source: 'collectionsExport_lockcollectionsChangeIndex', count: 2}),
            expect.objectContaining({source: 'collectionsExport_lockcollections', count: 2})
        ])
    })

    it('creates a full baseline and resets the incremental watermark', async () => {
        const {exportDir, backupDir} = await makeTempDirs()
        await fs.writeFile(path.join(exportDir, 'lockcollections.json'), JSON.stringify({
            metadata: {},
            data: [{docId: 'stale-user', displayName: 'Stale'}]
        }))
        await fs.writeFile(path.join(exportDir, 'lockcollections.exportState.json'), JSON.stringify({
            lastSuccessfulExportChangedAt: {
                seconds: Timestamp.fromDate(new Date('2026-09-01T00:00:00.000Z')).seconds,
                nanoseconds: 0,
                iso: '2026-09-01T00:00:00.000Z'
            },
            processedChangeKeys: []
        }))

        const runDate = new Date('2026-09-11T15:30:00.000Z')
        const changedAt = Timestamp.fromDate(new Date('2026-09-11T15:29:00.000Z'))
        const {db, getAll, sourceGet, where} = createFullExportDb(changedAt)
        const activityLogger = vi.fn().mockResolvedValue(undefined)

        const fullDb = await runCollectionsExport({
            db,
            backupDir,
            exportDir,
            lookbackMs: 300_000,
            activityLogger,
            now: () => runDate,
            fullExport: true
        })

        expect(sourceGet).toHaveBeenCalledOnce()
        expect(getAll).toHaveBeenCalledOnce()
        expect(where).toHaveBeenCalledWith(
            'changedAt',
            '>',
            Timestamp.fromDate(new Date('2026-09-11T15:25:00.000Z'))
        )
        expect(fullDb.__collections__.lockcollections).toEqual({
            'user-1': {displayName: 'Reconciled'}
        })

        const rawExport = JSON.parse(await fs.readFile(
            path.join(exportDir, 'lockcollections.json'),
            'utf8'
        ))
        expect(rawExport.metadata).toMatchObject({
            incremental: false,
            fullExport: true,
            bootstrapped: true,
            docCount: 1,
            changedDocCount: 2,
            deletedDocCount: 1,
            lockcollectionReadCount: 4,
            previousWatermark: {iso: '2026-09-01T00:00:00.000Z'},
            queryWatermark: {iso: '2026-09-11T15:30:00.000Z'},
            newWatermark: {iso: '2026-09-11T15:30:00.000Z'}
        })

        const state = JSON.parse(await fs.readFile(
            path.join(exportDir, 'lockcollections.exportState.json'),
            'utf8'
        ))
        expect(state.lastSuccessfulExportChangedAt.iso).toBe('2026-09-11T15:30:00.000Z')
        expect(state.lastRun.fullExport).toBe(true)
        expect(activityLogger).toHaveBeenCalledWith([
            expect.objectContaining({source: 'collectionsExport_lockcollectionsChangeIndex', count: 2}),
            expect.objectContaining({source: 'collectionsExport_lockcollections', count: 4})
        ])
    })
})
