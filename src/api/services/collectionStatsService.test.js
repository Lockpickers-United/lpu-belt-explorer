import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {
    getAllLockCollectionStats,
    getCollectionStatsPath
} from './collectionStatsService.js'

const temporaryDirectories = []

afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

describe('collection statistics generated-data contract', () => {
    it('reads file updates from COLLECTION_API_DIR without restarting', async () => {
        const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'collection-stats-'))
        temporaryDirectories.push(directory)
        const filePath = path.join(directory, 'collectionStatsByIdFull.json')
        const env = {NODE_ENV: 'development', COLLECTION_API_DIR: directory}
        await fs.writeFile(filePath, JSON.stringify({
            metadata: {updatedDate: '2026-09-22'},
            data: {locks: [{id: 'one', ownCount: 1}]}
        }))

        expect((await getAllLockCollectionStats(env)).metadata.updatedDate).toBe('2026-09-22')

        await fs.writeFile(filePath, JSON.stringify({
            metadata: {updatedDate: '2026-09-23'},
            data: {locks: [{id: 'one', ownCount: 42}]}
        }))

        const refreshed = await getAllLockCollectionStats(env)
        expect(refreshed.metadata.updatedDate).toBe('2026-09-23')
        expect(refreshed.data.locks[0].ownCount).toBe(42)
    })

    it('does not silently use the checked-in fixture in production', () => {
        expect(() => getCollectionStatsPath({NODE_ENV: 'production'}))
            .toThrow(/COLLECTION_API_DIR is required/)
    })
})
