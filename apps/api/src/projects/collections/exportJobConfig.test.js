import {describe, expect, it} from 'vitest'
import {
    defaultFirestoreDatabaseId,
    exportJobConfigSummary,
    loadExportJobConfig
} from './exportJobConfig.js'

const developmentEnv = {
    LPU_JOB_ENV: 'development',
    FIREBASE_PROJECT_ID: 'lpu-belt-explorer',
    FIRESTORE_DATABASE_ID: 'lpubelts-dev',
    FIREBASE_SERVICE_ACCOUNT_PATH: '/tmp/lpu/service-account.json',
    COLLECTION_EXPORT_DIR: '/tmp/lpu/exports',
    COLLECTION_BACKUP_DIR: '/tmp/lpu/backups',
    COLLECTION_PUBLIC_DATA_DIR: '/tmp/lpu/public-data',
    COLLECTION_DAILY_DIR: '/tmp/lpu/daily',
    COLLECTION_API_DIR: '/tmp/lpu/api-data'
}

describe('loadExportJobConfig', () => {
    it('loads explicit development configuration without inspecting the OS username', () => {
        const config = loadExportJobConfig({
            env: {
                ...developmentEnv,
                USER: 'an-unknown-user',
                LOGNAME: 'another-unknown-user'
            },
            requirePublicDataDir: true
        })

        expect(config).toEqual({
            jobEnvironment: 'development',
            firebaseProjectId: 'lpu-belt-explorer',
            firestoreDatabaseId: 'lpubelts-dev',
            serviceAccountPath: '/tmp/lpu/service-account.json',
            exportDir: '/tmp/lpu/exports',
            backupDir: '/tmp/lpu/backups',
            publicDataDir: '/tmp/lpu/public-data',
            dailyDir: '/tmp/lpu/daily',
            apiDir: '/tmp/lpu/api-data',
            lookbackMs: 300_000,
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
    })

    it('fails closed when the job environment is missing', () => {
        const {LPU_JOB_ENV: _jobEnvironment, ...env} = developmentEnv

        expect(() => loadExportJobConfig({env})).toThrowError(expect.objectContaining({
            code: 'export_job_config_missing'
        }))
    })

    it('requires explicit production permission for production output mode', () => {
        expect(() => loadExportJobConfig({
            env: {...developmentEnv, LPU_JOB_ENV: 'production'}
        })).toThrowError(expect.objectContaining({
            code: 'export_job_production_not_allowed'
        }))
    })

    it('requires explicit production permission for the default Firestore database', () => {
        expect(() => loadExportJobConfig({
            env: {...developmentEnv, FIRESTORE_DATABASE_ID: defaultFirestoreDatabaseId}
        })).toThrowError(expect.objectContaining({
            code: 'export_job_production_not_allowed'
        }))
    })

    it('accepts an explicitly enabled production job', () => {
        const config = loadExportJobConfig({
            env: {
                ...developmentEnv,
                LPU_JOB_ENV: 'production',
                FIRESTORE_DATABASE_ID: defaultFirestoreDatabaseId,
                ALLOW_PRODUCTION_JOB: 'true'
            }
        })

        expect(exportJobConfigSummary(config)).toMatchObject({
            jobEnvironment: 'production',
            firestoreDatabaseId: defaultFirestoreDatabaseId,
            productionAccessEnabled: true
        })
    })

    it('rejects relative credential and output paths', () => {
        expect(() => loadExportJobConfig({
            env: {...developmentEnv, COLLECTION_EXPORT_DIR: './exports'}
        })).toThrowError(expect.objectContaining({
            code: 'export_job_config_invalid_path'
        }))
    })

    it('requires the public data directory only for jobs that use it', () => {
        const {COLLECTION_PUBLIC_DATA_DIR: _publicDataDir, ...env} = developmentEnv

        expect(loadExportJobConfig({env}).publicDataDir).toBeNull()
        expect(() => loadExportJobConfig({env, requirePublicDataDir: true}))
            .toThrowError(expect.objectContaining({code: 'export_job_config_missing'}))
    })

    it('requires analyzer output directories only for jobs that use them', () => {
        const {
            COLLECTION_DAILY_DIR: _dailyDir,
            COLLECTION_API_DIR: _apiDir,
            ...env
        } = developmentEnv

        const config = loadExportJobConfig({env})
        expect(config.dailyDir).toBeNull()
        expect(config.apiDir).toBeNull()
        expect(() => loadExportJobConfig({env, requireDailyDir: true}))
            .toThrowError(expect.objectContaining({code: 'export_job_config_missing'}))
        expect(() => loadExportJobConfig({env, requireApiDir: true}))
            .toThrowError(expect.objectContaining({code: 'export_job_config_missing'}))
    })
})
