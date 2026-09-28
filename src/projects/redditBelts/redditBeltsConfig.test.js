import {describe, expect, it} from 'vitest'
import {loadRedditBeltsConfig} from './redditBeltsConfig.js'

const developmentEnv = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    REDDIT_BELTS_ENABLED: 'true',
    REDDIT_BELTS_SCRIPT_PATH: '/srv/lpu/fetch_reddit_flairs.py',
    REDDIT_CREDENTIALS_PATH: '/srv/lpu/keys_deprecated/reddit-keys.json',
    REDDIT_BELTS_OUTPUT_DIR: '/srv/lpu/public/data'
}

describe('loadRedditBeltsConfig', () => {
    it('returns an immutable enabled configuration', () => {
        const config = loadRedditBeltsConfig({env: developmentEnv})

        expect(config).toEqual({
            enabled: true,
            environment: 'development',
            runtimeEnvironment: 'development',
            scriptPath: '/srv/lpu/fetch_reddit_flairs.py',
            credentialsPath: '/srv/lpu/keys_deprecated/reddit-keys.json',
            outputDir: '/srv/lpu/public/data',
            pythonExecutable: 'python3',
            timeoutMs: 120_000,
            maxOutputBytes: 10 * 1024 * 1024,
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
    })

    it('defaults to disabled without requiring integration configuration', () => {
        const config = loadRedditBeltsConfig({env: {NODE_ENV: 'test'}})

        expect(config.enabled).toBe(false)
        expect(config.outputDir).toBeNull()
        expect(config.credentialsPath).toBeNull()
    })

    it('rejects invalid enable values', () => {
        expect(() => loadRedditBeltsConfig({
            env: {...developmentEnv, REDDIT_BELTS_ENABLED: 'yes'}
        })).toThrowError(expect.objectContaining({code: 'reddit_belts_config_invalid_enabled'}))
    })

    it('requires explicit absolute paths when enabled', () => {
        expect(() => loadRedditBeltsConfig({
            env: {...developmentEnv, REDDIT_CREDENTIALS_PATH: ''}
        })).toThrowError(expect.objectContaining({code: 'reddit_belts_config_missing'}))
        expect(() => loadRedditBeltsConfig({
            env: {...developmentEnv, REDDIT_BELTS_OUTPUT_DIR: './data'}
        })).toThrowError(expect.objectContaining({code: 'reddit_belts_config_invalid_path'}))
    })

    it('validates process limits', () => {
        expect(() => loadRedditBeltsConfig({
            env: {...developmentEnv, REDDIT_BELTS_TIMEOUT_MS: '999'}
        })).toThrowError(expect.objectContaining({code: 'reddit_belts_config_invalid_number'}))
        expect(() => loadRedditBeltsConfig({
            env: {...developmentEnv, REDDIT_BELTS_MAX_OUTPUT_BYTES: '100'}
        })).toThrowError(expect.objectContaining({code: 'reddit_belts_config_invalid_number'}))
    })

    it('requires explicit production opt-in', () => {
        expect(() => loadRedditBeltsConfig({
            env: {...developmentEnv, LPU_JOB_ENV: 'production'}
        })).toThrowError(expect.objectContaining({code: 'reddit_belts_production_not_allowed'}))
    })

    it('does not use USER or LOGNAME for target selection', () => {
        const config = loadRedditBeltsConfig({
            env: {
                ...developmentEnv,
                USER: 'unknown-production-looking-user',
                LOGNAME: 'unknown-production-looking-user'
            }
        })

        expect(config.environment).toBe('development')
        expect(config.outputDir).toBe('/srv/lpu/public/data')
    })
})
