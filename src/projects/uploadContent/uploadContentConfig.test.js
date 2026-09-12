import {describe, expect, it} from 'vitest'
import {loadUploadContentConfig} from './uploadContentConfig.js'

const developmentEnv = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    CONTENT_UPLOAD_DIR: '/tmp/content-uploads'
}

describe('loadUploadContentConfig', () => {
    it('returns an immutable, normalized configuration', () => {
        const config = loadUploadContentConfig({env: developmentEnv})

        expect(config).toEqual({
            environment: 'development',
            runtimeEnvironment: 'development',
            uploadDir: '/tmp/content-uploads',
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
    })

    it('fails closed when the explicit environment is missing', () => {
        const {LPU_JOB_ENV: _environment, ...env} = developmentEnv

        expect(() => loadUploadContentConfig({env})).toThrowError(
            expect.objectContaining({code: 'upload_content_config_missing'})
        )
    })

    it('requires an absolute upload directory', () => {
        expect(() => loadUploadContentConfig({
            env: {...developmentEnv, CONTENT_UPLOAD_DIR: './uploads'}
        })).toThrowError(expect.objectContaining({code: 'upload_content_config_invalid_path'}))
    })

    it('requires explicit production opt-in', () => {
        expect(() => loadUploadContentConfig({
            env: {...developmentEnv, LPU_JOB_ENV: 'production'}
        })).toThrowError(expect.objectContaining({code: 'upload_content_production_not_allowed'}))
    })

    it('does not use USER or LOGNAME for path selection', () => {
        const config = loadUploadContentConfig({
            env: {
                ...developmentEnv,
                USER: 'unknown-production-looking-user',
                LOGNAME: 'unknown-production-looking-user'
            }
        })

        expect(config.uploadDir).toBe('/tmp/content-uploads')
    })
})
