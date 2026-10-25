import {describe, expect, it} from 'vitest'
import {loadEmailFormConfig} from './emailFormContentsConfig.js'

const developmentEnv = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    EMAIL_FORM_ENABLED: 'true'
}

describe('loadEmailFormConfig', () => {
    it('returns an immutable enabled configuration', () => {
        const config = loadEmailFormConfig({env: developmentEnv})

        expect(config).toEqual({
            enabled: true,
            environment: 'development',
            runtimeEnvironment: 'development',
            productionAccessEnabled: false
        })
        expect(Object.isFrozen(config)).toBe(true)
    })

    it('defaults to disabled without requiring integration configuration', () => {
        const config = loadEmailFormConfig({env: {NODE_ENV: 'test'}})

        expect(config).toEqual({
            enabled: false,
            environment: null,
            runtimeEnvironment: 'test',
            productionAccessEnabled: false
        })
    })

    it('rejects invalid enable values', () => {
        expect(() => loadEmailFormConfig({
            env: {...developmentEnv, EMAIL_FORM_ENABLED: 'yes'}
        })).toThrowError(expect.objectContaining({code: 'email_form_config_invalid_enabled'}))
    })

    it('requires an explicit environment when enabled', () => {
        const {LPU_JOB_ENV: _environment, ...env} = developmentEnv

        expect(() => loadEmailFormConfig({env})).toThrowError(
            expect.objectContaining({code: 'email_form_config_missing'})
        )
    })

    it('requires explicit production opt-in', () => {
        expect(() => loadEmailFormConfig({
            env: {...developmentEnv, LPU_JOB_ENV: 'production'}
        })).toThrowError(expect.objectContaining({code: 'email_form_production_not_allowed'}))
    })

    it('does not use USER or LOGNAME for environment selection', () => {
        const config = loadEmailFormConfig({
            env: {
                ...developmentEnv,
                USER: 'unknown-production-looking-user',
                LOGNAME: 'unknown-production-looking-user'
            }
        })

        expect(config.environment).toBe('development')
    })
})
