import {describe, expect, it} from 'vitest'
import {loadRequestLockConfig} from './requestLockConfig.js'

const developmentEnv = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    FIREBASE_PROJECT_ID: 'lpu-belt-explorer',
    FIRESTORE_DATABASE_ID: 'lpubelts-dev',
    FIREBASE_SERVICE_ACCOUNT_PATH: '/tmp/service-account.json',
    REQUESTED_LOCKS_UPLOAD_DIR: '/tmp/requested-locks',
    REQUESTED_LOCKS_PUBLIC_URL: 'https://example.test/img/requestedLocks/'
}

describe('loadRequestLockConfig', () => {
    it('returns an immutable, normalized development configuration', () => {
        const config = loadRequestLockConfig({env: developmentEnv})

        expect(config).toMatchObject({
            environment: 'development',
            runtimeEnvironment: 'development',
            firestoreDatabaseId: 'lpubelts-dev',
            uploadDir: '/tmp/requested-locks',
            publicImageBaseUrl: 'https://example.test/img/requestedLocks',
            productionData: false,
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
    })

    it('fails closed when the explicit environment is missing', () => {
        const {LPU_JOB_ENV: _environment, ...env} = developmentEnv

        expect(() => loadRequestLockConfig({env})).toThrowError(
            expect.objectContaining({code: 'request_lock_config_missing'})
        )
    })

    it('requires an explicit opt-in for the default Firestore database', () => {
        expect(() => loadRequestLockConfig({
            env: {...developmentEnv, FIRESTORE_DATABASE_ID: '(default)'}
        })).toThrowError(expect.objectContaining({code: 'request_lock_production_not_allowed'}))
    })

    it('allows an explicitly approved production target', () => {
        const config = loadRequestLockConfig({
            env: {
                ...developmentEnv,
                LPU_JOB_ENV: 'production',
                FIRESTORE_DATABASE_ID: '(default)',
                ALLOW_PRODUCTION_JOB: 'true'
            }
        })

        expect(config.productionData).toBe(true)
        expect(config.productionAccessEnabled).toBe(true)
    })

    it('does not use USER or LOGNAME for target selection', () => {
        const config = loadRequestLockConfig({
            env: {
                ...developmentEnv,
                USER: 'unknown-production-looking-user',
                LOGNAME: 'unknown-production-looking-user'
            }
        })

        expect(config.firestoreDatabaseId).toBe('lpubelts-dev')
        expect(config.productionData).toBe(false)
    })
})
