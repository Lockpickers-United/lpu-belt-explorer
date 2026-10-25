#!/usr/bin/env node

import {readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import isDirectRun from '../src/util/isDirectRun.js'
import {loadRuntimeEnvironment} from '../src/util/runtimeEnvironment.js'
import {getFirestoreDb} from '../src/api/services/firebaseAdmin.js'
import {getCatalogVersion} from '../src/api/services/classificationCatalog.js'
import {createClassificationGcloudDb} from '../src/api/services/classificationGcloudDb.js'
import {
    applyClassificationMigration,
    assertDevelopmentTarget,
    assertProductionTarget,
    buildClassificationMigration,
    inspectClassificationTarget
} from '../src/api/services/classificationMigration.js'

const projectRoot = path.resolve(import.meta.dirname, '..')

function optionsFrom(args) {
    const [mode, ...rest] = args
    if (!['plan', 'inspect', 'apply'].includes(mode)) {
        throw new Error('Use plan, inspect, or apply')
    }
    const options = {mode}
    const allowed = new Set(['source', 'catalog', 'full-catalog', 'manifest', 'target',
        'allow-live', 'confirm-write', 'backup-record', 'auth', 'active-catalog-version'])
    for (let index = 0; index < rest.length; index++) {
        const name = rest[index]
        if (!name.startsWith('--') || !rest[index + 1] || rest[index + 1].startsWith('--')) {
            throw new Error(`Invalid option: ${name}`)
        }
        const key = name.slice(2)
        if (!allowed.has(key) || options[key]) throw new Error(`Unknown or duplicate option: ${name}`)
        options[key] = rest[++index]
    }
    for (const name of ['source', 'catalog', 'full-catalog', 'manifest']) {
        if (!options[name]) throw new Error(`Missing --${name}`)
    }
    return options
}

function requireBackupRecord(record, manifest) {
    if (record?.databaseId !== manifest.target.databaseId
        || record.projectId !== 'lpu-belt-explorer'
        || record.catalogVersion !== manifest.catalogVersion
        || typeof record.location !== 'string' || !record.location.startsWith('gs://')
        || typeof record.exportedAt !== 'string' || Number.isNaN(Date.parse(record.exportedAt))
        || Date.parse(record.exportedAt) < Date.parse(manifest.migrationTime)
        || !record.ruleset || !record.indexConfiguration || !record.apiRelease) {
        throw new Error('Backup record must identify the target, catalog, export, rules, indexes, and API release')
    }
}

export async function runClassificationMigration(args, {
    env = process.env,
    loadEnvironment = loadRuntimeEnvironment,
    getDb = getFirestoreDb,
    catalogVersion = getCatalogVersion,
    getGcloudDb = createClassificationGcloudDb
} = {}) {
    const options = optionsFrom(args)
    if (options.auth && options.auth !== 'gcloud') throw new Error('Only --auth gcloud is supported')
    const target = options.target ?? 'development'
    if (!['development', 'production'].includes(target)) throw new Error('Unsupported migration target')
    const databaseId = target === 'production' ? '(default)' : 'lpubelts-dev'
    const [sourceBytes, catalogBytes, fullCatalogBytes] = await Promise.all([
        readFile(options.source), readFile(options.catalog), readFile(options['full-catalog'])
    ])
    const savedManifest = options.mode === 'plan' ? null
        : JSON.parse(await readFile(options.manifest, 'utf8'))
    const migrationTime = savedManifest?.migrationTime ?? new Date().toISOString()
    const {manifest, documents} = buildClassificationMigration({
        sourceBytes, catalogBytes, fullCatalogBytes, migrationTime, targetDatabaseId: databaseId
    })

    if (options.mode === 'plan') {
        await writeFile(options.manifest, `${JSON.stringify(manifest, null, 2)}\n`, {flag: 'wx', mode: 0o600})
        return {mode: 'plan', manifestPath: options.manifest, counts: manifest.counts,
            sourceSha256: manifest.sourceSha256, catalogVersion: manifest.catalogVersion,
            catalogSha256: manifest.catalogSha256, planSha256: manifest.planSha256}
    }
    if (JSON.stringify(savedManifest) !== JSON.stringify(manifest)) {
        throw new Error('Manifest does not match the source, catalog, or migration plan')
    }
    if (options['allow-live'] !== databaseId) {
        throw new Error(`Live inspection or writes require --allow-live ${databaseId}`)
    }
    let backupRecord
    if (options.mode === 'apply') {
        if (options['confirm-write'] !== manifest.planSha256) {
            throw new Error('Apply requires --confirm-write equal to the plan fingerprint')
        }
        if (!options['backup-record']) throw new Error('Apply requires --backup-record')
        backupRecord = JSON.parse(await readFile(options['backup-record'], 'utf8'))
        requireBackupRecord(backupRecord, manifest)
    }
    loadEnvironment({env, envDir: projectRoot})
    if (target === 'production') assertProductionTarget(env)
    else assertDevelopmentTarget(env)
    if (options.auth === 'gcloud') {
        if (options['active-catalog-version'] !== manifest.catalogVersion) {
            throw new Error('Gcloud mode requires a separately verified active API catalog version')
        }
    } else if (catalogVersion() !== manifest.catalogVersion) {
        throw new Error('Configured API catalog version differs from the migration manifest')
    }
    const db = options.auth === 'gcloud' ? getGcloudDb({databaseId}) : await getDb()
    const inspection = await inspectClassificationTarget(db, documents)
    const result = {
        mode: options.mode, databaseId,
        absent: inspection.absent.length, matching: inspection.matching.length,
        conflicts: inspection.conflicts
    }
    if (options.mode === 'inspect') return result
    if (inspection.conflicts.length) throw new Error('Import target has conflicting documents')
    result.created = await applyClassificationMigration(db, documents, inspection)
    const verification = await inspectClassificationTarget(db, documents)
    if (verification.absent.length || verification.conflicts.length) {
        throw new Error('Post-import verification found missing or conflicting documents')
    }
    result.verified = verification.matching.length
    return result
}

if (isDirectRun(import.meta.url)) {
    runClassificationMigration(process.argv.slice(2))
        .then(result => {
            process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
            if (result.conflicts?.length) process.exitCode = 1
        })
        .catch(error => {
            process.stderr.write(`${error.message}\n`)
            process.exitCode = 1
        })
}
