import {createHash} from 'node:crypto'
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest'
import {buildClassificationMigration} from '../src/api/services/classificationMigration.js'
import {runClassificationMigration} from './migrateClassificationDev.js'
import {runProductionClassificationMigration} from './migrateClassificationProduction.js'

const env = {
    NODE_ENV: 'development', LPU_JOB_ENV: 'development',
    FIREBASE_PROJECT_ID: 'lpu-belt-explorer', FIRESTORE_DATABASE_ID: 'lpubelts-dev'
}
let directory
let paths
let manifest

beforeAll(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), 'classification-migration-test-'))
    paths = Object.fromEntries(['source', 'catalog', 'full-catalog', 'manifest']
        .map(name => [name, path.join(directory, `${name}.json`)]))
    const fullCatalogBytes = Buffer.from('[]')
    const catalogVersion = `sha256:${createHash('sha256').update(fullCatalogBytes).digest('hex')}`
    const catalogBytes = Buffer.from(JSON.stringify({
        schemaVersion: 1, catalogVersion,
        entries: [{id: 'sample', name: 'Sample lock', belt: 'Blue',
            currentBeltDate: '2026-01-01T00:00:00.000Z'}]
    }))
    const sourceBytes = Buffer.from(JSON.stringify([{
        id: 'source-one', type: 'vote', source: 'sheet', entryId: 'sample',
        userId: 'reader', displayName: 'Reader', votedBelt: 'Blue',
        createdAt: '2026-01-02T00:00:00.000Z'
    }]))
    manifest = buildClassificationMigration({
        sourceBytes, catalogBytes, fullCatalogBytes,
        migrationTime: '2026-01-03T00:00:00.000Z'
    }).manifest
    paths.productionManifest = path.join(directory, 'production-inspection-manifest.json')
    const productionManifest = buildClassificationMigration({
        sourceBytes, catalogBytes, fullCatalogBytes,
        migrationTime: '2026-01-03T00:00:00.000Z', targetDatabaseId: '(default)'
    }).manifest
    await Promise.all([
        writeFile(paths.source, sourceBytes),
        writeFile(paths.catalog, catalogBytes),
        writeFile(paths['full-catalog'], fullCatalogBytes),
        writeFile(paths.manifest, `${JSON.stringify(manifest, null, 2)}\n`),
        writeFile(paths.productionManifest, `${JSON.stringify(productionManifest, null, 2)}\n`)
    ])
})

afterAll(async () => {
    if (directory) await rm(directory, {recursive: true, force: true})
})

function args(version) {
    return [
        'inspect', '--source', paths.source, '--catalog', paths.catalog,
        '--full-catalog', paths['full-catalog'], '--manifest', paths.manifest,
        '--allow-live', 'lpubelts-dev', '--auth', 'gcloud',
        '--active-catalog-version', version
    ]
}

describe('Classification migration command Google Cloud mode', () => {
    it('rejects an unverified catalog version before opening a database', async () => {
        const getGcloudDb = vi.fn()
        await expect(runClassificationMigration(args('wrong'), {
            env: {...env}, loadEnvironment: () => {}, getGcloudDb
        })).rejects.toThrow('separately verified active API catalog version')
        expect(getGcloudDb).not.toHaveBeenCalled()
    })

    it('inspects only the guarded development target without a service account', async () => {
        const requested = []
        const getGcloudDb = vi.fn(() => ({
            collection(name) {
                requested.push(name)
                return {get: async () => ({docs: []})}
            }
        }))
        const result = await runClassificationMigration(args(manifest.catalogVersion), {
            env: {...env}, loadEnvironment: () => {}, getGcloudDb,
            getDb: () => { throw new Error('Service account must not be used') },
            catalogVersion: () => { throw new Error('Missing local catalog must not be used') }
        })
        expect(result).toMatchObject({mode: 'inspect', databaseId: 'lpubelts-dev',
            absent: 3, matching: 0, conflicts: []})
        expect(requested).toEqual([
            'classificationVotes', 'classificationEntries', 'classificationEntryStates',
            'classificationActions', 'classificationPublications', 'classificationOperations'
        ])
        expect(getGcloudDb).toHaveBeenCalledOnce()
        expect(JSON.parse(await readFile(paths.manifest, 'utf8'))).toEqual(manifest)
    })
})


describe('Classification production migration command', () => {
    it('freezes a production-target plan without opening a database', async () => {
        const productionManifestPath = path.join(directory, 'production-plan-manifest.json')
        const getDb = vi.fn()
        const result = await runProductionClassificationMigration([
            'plan', '--source', paths.source, '--catalog', paths.catalog,
            '--full-catalog', paths['full-catalog'], '--manifest', productionManifestPath
        ], {getDb})
        const productionManifest = JSON.parse(await readFile(productionManifestPath, 'utf8'))
        expect(productionManifest.target).toEqual({
            projectId: 'lpu-belt-explorer', databaseId: '(default)'
        })
        expect(result.planSha256).toBe(productionManifest.planSha256)
        expect(getDb).not.toHaveBeenCalled()
    })

    it('rejects a development backup or wrong plan fingerprint before production writes', async () => {
        const productionManifest = JSON.parse(await readFile(paths.productionManifest, 'utf8'))
        const backupRecordPath = path.join(directory, 'wrong-production-backup.json')
        await writeFile(backupRecordPath, JSON.stringify({
            projectId: 'lpu-belt-explorer', databaseId: 'lpubelts-dev',
            catalogVersion: productionManifest.catalogVersion,
            location: 'gs://test-bucket/classification-backup',
            exportedAt: '2026-01-04T00:00:00.000Z',
            ruleset: 'test-rules', indexConfiguration: 'test-indexes', apiRelease: 'test-api'
        }))
        const getGcloudDb = vi.fn()
        const dependencies = {env: {
            NODE_ENV: 'production', LPU_JOB_ENV: 'production',
            FIREBASE_PROJECT_ID: 'lpu-belt-explorer', FIRESTORE_DATABASE_ID: '(default)',
            ALLOW_PRODUCTION_JOB: 'true'
        }, loadEnvironment: () => {}, getGcloudDb}
        const applyArgs = [
            'apply', '--source', paths.source, '--catalog', paths.catalog,
            '--full-catalog', paths['full-catalog'], '--manifest', paths.productionManifest,
            '--allow-live', '(default)', '--auth', 'gcloud',
            '--active-catalog-version', productionManifest.catalogVersion,
            '--backup-record', backupRecordPath
        ]
        await expect(runProductionClassificationMigration([
            ...applyArgs, '--confirm-write', 'wrong'
        ], dependencies)).rejects.toThrow('plan fingerprint')
        await expect(runProductionClassificationMigration([
            ...applyArgs, '--confirm-write', productionManifest.planSha256
        ], dependencies)).rejects.toThrow('Backup record')
        expect(getGcloudDb).not.toHaveBeenCalled()
    })

    it('requires explicit production target, environment, and active catalog before inspection', async () => {
        const productionManifestPath = paths.productionManifest
        const productionArgs = [
            'inspect', '--source', paths.source, '--catalog', paths.catalog,
            '--full-catalog', paths['full-catalog'], '--manifest', productionManifestPath,
            '--auth', 'gcloud', '--active-catalog-version', manifest.catalogVersion
        ]
        const getGcloudDb = vi.fn(() => ({
            collection: () => ({get: async () => ({docs: []})})
        }))
        const productionEnv = {
            NODE_ENV: 'production', LPU_JOB_ENV: 'production',
            FIREBASE_PROJECT_ID: 'lpu-belt-explorer',
            FIRESTORE_DATABASE_ID: '(default)', ALLOW_PRODUCTION_JOB: 'true'
        }
        const dependencies = {env: productionEnv, loadEnvironment: () => {}, getGcloudDb}
        await expect(runProductionClassificationMigration(productionArgs, dependencies))
            .rejects.toThrow('allow-live')
        await expect(runProductionClassificationMigration([
            ...productionArgs, '--allow-live', '(default)'
        ], {...dependencies, env: env})).rejects.toThrow('production target')
        await expect(runProductionClassificationMigration([
            ...productionArgs, '--allow-live', '(default)'
        ], {...dependencies, env: {...productionEnv, ALLOW_PRODUCTION_JOB: 'false'}}))
            .rejects.toThrow('production target')
        expect(getGcloudDb).not.toHaveBeenCalled()
        const result = await runProductionClassificationMigration([
            ...productionArgs, '--allow-live', '(default)'
        ], dependencies)
        expect(result).toMatchObject({databaseId: '(default)', absent: 3, conflicts: []})
        expect(getGcloudDb).toHaveBeenCalledWith({databaseId: '(default)'})
    })
})
