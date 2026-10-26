import {describe, expect, it} from 'vitest'
import {loadImportRaflDataConfig} from './importRaflDataConfig.js'

const developmentEnv = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    RAFL_PREVIEW_ENABLED: 'true',
    RAFL_SHEET_ID: 'test-sheet-id-12345',
    RAFL_PREVIEW_OUTPUT_DIR: '/tmp/rafl-preview'
}

describe('loadImportRaflDataConfig', () => {
    it('returns an immutable enabled configuration', () => {
        const config = loadImportRaflDataConfig({env: developmentEnv})

        expect(config).toEqual({
            enabled: true,
            environment: 'development',
            runtimeEnvironment: 'development',
            outputDir: '/tmp/rafl-preview',
            sheetId: 'test-sheet-id-12345',
            timeoutMs: 15_000,
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
    })

    it('defaults to disabled without requiring integration configuration', () => {
        const config = loadImportRaflDataConfig({env: {NODE_ENV: 'test'}})

        expect(config).toEqual({
            enabled: false,
            environment: null,
            runtimeEnvironment: 'test',
            outputDir: null,
            sheetId: null,
            timeoutMs: null,
            productionAccessEnabled: false
        })
    })

    it('rejects invalid enable values', () => {
        expect(() => loadImportRaflDataConfig({
            env: {...developmentEnv, RAFL_PREVIEW_ENABLED: 'yes'}
        })).toThrowError(expect.objectContaining({code: 'rafl_preview_config_invalid_enabled'}))
    })

    it('requires an explicit sheet ID and absolute output directory when enabled', () => {
        expect(() => loadImportRaflDataConfig({
            env: {...developmentEnv, RAFL_SHEET_ID: ''}
        })).toThrowError(expect.objectContaining({code: 'rafl_preview_config_missing'}))
        expect(() => loadImportRaflDataConfig({
            env: {...developmentEnv, RAFL_PREVIEW_OUTPUT_DIR: './preview'}
        })).toThrowError(expect.objectContaining({code: 'rafl_preview_config_invalid_path'}))
    })

    it('validates the request timeout', () => {
        expect(() => loadImportRaflDataConfig({
            env: {...developmentEnv, RAFL_PREVIEW_TIMEOUT_MS: '999'}
        })).toThrowError(expect.objectContaining({code: 'rafl_preview_config_invalid_timeout'}))
    })

    it('requires explicit production opt-in', () => {
        expect(() => loadImportRaflDataConfig({
            env: {...developmentEnv, LPU_JOB_ENV: 'production'}
        })).toThrowError(expect.objectContaining({code: 'rafl_preview_production_not_allowed'}))
    })

    it('does not use USER or LOGNAME for target selection', () => {
        const config = loadImportRaflDataConfig({
            env: {
                ...developmentEnv,
                USER: 'unknown-production-looking-user',
                LOGNAME: 'unknown-production-looking-user'
            }
        })

        expect(config.environment).toBe('development')
        expect(config.outputDir).toBe('/tmp/rafl-preview')
    })
})
