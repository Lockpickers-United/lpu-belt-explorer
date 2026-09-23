import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    loadCatalogArray,
    loadCatalogDataConfig,
    loadCatalogRefreshConfig
} from './catalogData.js'

const directories = []

afterEach(async () => {
    await Promise.all(directories.splice(0).map(directory => fs.rm(directory, {recursive: true, force: true})))
})

describe('catalog data', () => {
    it('loads reviewed filesystem snapshots', async () => {
        const catalogDir = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-data-'))
        directories.push(catalogDir)
        await fs.writeFile(path.join(catalogDir, 'data.json'), JSON.stringify([{id: 'lock-1'}]))

        await expect(loadCatalogArray('data.json', {
            env: {LPU_CATALOG_SOURCE: 'filesystem', LPU_CATALOG_DIR: catalogDir}
        })).resolves.toEqual([{id: 'lock-1'}])
    })

    it('uses HTTPS, a timeout signal, and a response-size limit in remote mode', async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            headers: {get: vi.fn().mockReturnValue('17')},
            text: vi.fn().mockResolvedValue('[{"id":"lock-1"}]')
        })
        await loadCatalogArray('data.json', {
            env: {
                LPU_CATALOG_SOURCE: 'remote',
                LPU_CATALOG_BASE_URL: 'https://catalog.example/data/',
                LPU_CATALOG_TIMEOUT_MS: '2000',
                LPU_CATALOG_MAX_BYTES: '2048'
            },
            fetchImpl
        })

        expect(fetchImpl).toHaveBeenCalledWith('https://catalog.example/data/data.json', {
            signal: expect.any(AbortSignal),
            size: 2048
        })
    })

    it('rejects insecure remote URLs and invalid schemas', async () => {
        expect(() => loadCatalogDataConfig({
            LPU_CATALOG_SOURCE: 'remote',
            LPU_CATALOG_BASE_URL: 'http://catalog.example'
        })).toThrow(/HTTPS/)

        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            headers: {get: vi.fn()},
            text: vi.fn().mockResolvedValue('{}')
        })
        await expect(loadCatalogArray('data.json', {
            env: {LPU_CATALOG_SOURCE: 'remote'},
            fetchImpl
        })).rejects.toThrow(/Invalid catalog array/)
    })

    it('builds an HTTPS refresh configuration for an absolute snapshot directory', () => {
        expect(loadCatalogRefreshConfig({
            LPU_CATALOG_REFRESH_ENABLED: 'true',
            LPU_CATALOG_DIR: '/srv/lpubelts/snapshots',
            LPU_CATALOG_BASE_URL: 'https://catalog.example',
            LPU_CATALOG_TIMEOUT_MS: '2000',
            LPU_CATALOG_MAX_BYTES: '4096'
        })).toMatchObject({
            enabled: true,
            catalogDir: '/srv/lpubelts/snapshots',
            baseUrl: 'https://catalog.example/',
            timeoutMs: 2000,
            maxBytes: 4096,
            remoteConfig: {source: 'remote'}
        })
    })

    it('does not require a snapshot directory when refresh is disabled', () => {
        expect(loadCatalogRefreshConfig({
            LPU_CATALOG_REFRESH_ENABLED: 'false',
            LPU_CATALOG_BASE_URL: 'https://catalog.example'
        })).toMatchObject({enabled: false, catalogDir: null})
    })
})
