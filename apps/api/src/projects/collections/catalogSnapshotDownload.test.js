import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {catalogFilenames} from '../../util/catalogData.js'
import {runCatalogSnapshotDownload} from './catalogSnapshotDownload.js'

const temporaryDirectories = []

afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

describe('runCatalogSnapshotDownload', () => {
    it('fetches, validates, and atomically publishes every catalog snapshot', async () => {
        const catalogDir = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-snapshots-'))
        temporaryDirectories.push(catalogDir)
        const remoteConfig = {source: 'remote', baseUrl: 'https://catalog.example/'}
        const catalogLoader = vi.fn(async filename => [{id: filename}])

        const result = await runCatalogSnapshotDownload({
            catalogDir,
            remoteConfig,
            catalogLoader
        })

        expect(result.files).toHaveLength(catalogFilenames.length)
        for (const filename of catalogFilenames) {
            expect(catalogLoader).toHaveBeenCalledWith(filename, {config: remoteConfig})
            await expect(fs.readFile(path.join(catalogDir, filename), 'utf8'))
                .resolves.toContain(`"id": "${filename}"`)
        }
        expect((await fs.readdir(catalogDir)).some(filename => filename.includes('.tmp-')))
            .toBe(false)
    })

    it('does not replace snapshots when any download fails', async () => {
        const catalogDir = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-snapshots-'))
        temporaryDirectories.push(catalogDir)
        await fs.writeFile(path.join(catalogDir, 'data.json'), '[{"id":"existing"}]')
        const catalogLoader = vi.fn(async filename => {
            if (filename === 'projects.json') throw new Error('download failed')
            return [{id: filename}]
        })

        await expect(runCatalogSnapshotDownload({
            catalogDir,
            remoteConfig: {source: 'remote'},
            catalogLoader
        })).rejects.toThrow('download failed')

        await expect(fs.readFile(path.join(catalogDir, 'data.json'), 'utf8'))
            .resolves.toContain('existing')
        await expect(fs.access(path.join(catalogDir, 'awards.json')))
            .rejects.toMatchObject({code: 'ENOENT'})
    })
})
