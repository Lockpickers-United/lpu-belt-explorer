import {describe, expect, it} from 'vitest'
import {
    firebaseActivityConfigSummary,
    loadFirebaseActivityConfig
} from './firebaseActivityConfig.js'

const developmentEnv = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    FIREBASE_ACTIVITY_LOGGING_ENABLED: 'true'
}

describe('loadFirebaseActivityConfig', () => {
    it('returns an immutable enabled configuration', () => {
        const config = loadFirebaseActivityConfig({env: developmentEnv})

        expect(config).toEqual({
            enabled: true,
            environment: 'development',
            runtimeEnvironment: 'development',
            productionData: false,
            maxBatchSize: 100,
            maxStringLength: 500,
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
        expect(firebaseActivityConfigSummary(config)).toEqual(config)
    })

    it('defaults to disabled without requiring runtime configuration', () => {
        const config = loadFirebaseActivityConfig({env: {NODE_ENV: 'test'}})

        expect(config.enabled).toBe(false)
        expect(config.environment).toBeNull()
    })

    it('rejects invalid enable values', () => {
        expect(() => loadFirebaseActivityConfig({
            env: {...developmentEnv, FIREBASE_ACTIVITY_LOGGING_ENABLED: 'yes'}
        })).toThrowError(expect.objectContaining({code: 'firebase_activity_config_invalid_enabled'}))
    })

    it('validates ingestion limits', () => {
        expect(() => loadFirebaseActivityConfig({
            env: {...developmentEnv, FIREBASE_ACTIVITY_MAX_BATCH_SIZE: '0'}
        })).toThrowError(expect.objectContaining({code: 'firebase_activity_config_invalid_number'}))
        expect(() => loadFirebaseActivityConfig({
            env: {...developmentEnv, FIREBASE_ACTIVITY_MAX_STRING_LENGTH: '5'}
        })).toThrowError(expect.objectContaining({code: 'firebase_activity_config_invalid_number'}))
    })

    it('derives production data from explicit environment selection', () => {
        const config = loadFirebaseActivityConfig({
            env: {
                ...developmentEnv,
                LPU_JOB_ENV: 'production',
                ALLOW_PRODUCTION_JOB: 'true'
            }
        })

        expect(config.productionData).toBe(true)
        expect(config.productionAccessEnabled).toBe(true)
    })

    it('requires explicit production opt-in', () => {
        expect(() => loadFirebaseActivityConfig({
            env: {...developmentEnv, LPU_JOB_ENV: 'production'}
        })).toThrowError(expect.objectContaining({code: 'firebase_activity_production_not_allowed'}))
    })

    it('does not use USER, LOGNAME, or client data for environment selection', () => {
        const config = loadFirebaseActivityConfig({
            env: {
                ...developmentEnv,
                USER: 'unknown-production-looking-user',
                LOGNAME: 'unknown-production-looking-user'
            }
        })

        expect(config.environment).toBe('development')
        expect(config.productionData).toBe(false)
    })
})
