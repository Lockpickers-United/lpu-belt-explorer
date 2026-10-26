import {describe, expect, it} from 'vitest'
import {flickrInfoConfigSummary, loadFlickrInfoConfig} from './flickrInfoConfig.js'

const developmentEnv = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    FLICKR_INFO_ENABLED: 'true',
    FLICKR_API_KEY: 'test-api-key'
}

describe('loadFlickrInfoConfig', () => {
    it('returns an immutable enabled configuration without exposing its key in the summary', () => {
        const config = loadFlickrInfoConfig({env: developmentEnv})

        expect(config).toEqual({
            enabled: true,
            environment: 'development',
            runtimeEnvironment: 'development',
            apiKey: 'test-api-key',
            timeoutMs: 30_000,
            maxPhotos: 500,
            concurrency: 5,
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
        expect(flickrInfoConfigSummary(config)).not.toHaveProperty('apiKey')
        expect(flickrInfoConfigSummary(config).apiKeyConfigured).toBe(true)
    })

    it('defaults to disabled without requiring an API key', () => {
        const config = loadFlickrInfoConfig({env: {NODE_ENV: 'test'}})

        expect(config.enabled).toBe(false)
        expect(config.apiKey).toBeNull()
    })

    it('rejects invalid enable values', () => {
        expect(() => loadFlickrInfoConfig({
            env: {...developmentEnv, FLICKR_INFO_ENABLED: 'yes'}
        })).toThrowError(expect.objectContaining({code: 'flickr_info_config_invalid_enabled'}))
    })

    it('requires an API key when enabled', () => {
        expect(() => loadFlickrInfoConfig({
            env: {...developmentEnv, FLICKR_API_KEY: ''}
        })).toThrowError(expect.objectContaining({code: 'flickr_info_config_missing'}))
    })

    it('validates request limits', () => {
        expect(() => loadFlickrInfoConfig({
            env: {...developmentEnv, FLICKR_INFO_TIMEOUT_MS: '999'}
        })).toThrowError(expect.objectContaining({code: 'flickr_info_config_invalid_number'}))
        expect(() => loadFlickrInfoConfig({
            env: {...developmentEnv, FLICKR_INFO_MAX_PHOTOS: '1001'}
        })).toThrowError(expect.objectContaining({code: 'flickr_info_config_invalid_number'}))
        expect(() => loadFlickrInfoConfig({
            env: {...developmentEnv, FLICKR_INFO_CONCURRENCY: '1.5'}
        })).toThrowError(expect.objectContaining({code: 'flickr_info_config_invalid_number'}))
    })

    it('requires explicit production opt-in', () => {
        expect(() => loadFlickrInfoConfig({
            env: {...developmentEnv, LPU_JOB_ENV: 'production'}
        })).toThrowError(expect.objectContaining({code: 'flickr_info_production_not_allowed'}))
    })

    it('does not use USER or LOGNAME for environment selection', () => {
        const config = loadFlickrInfoConfig({
            env: {
                ...developmentEnv,
                USER: 'unknown-production-looking-user',
                LOGNAME: 'unknown-production-looking-user'
            }
        })

        expect(config.environment).toBe('development')
    })
})
