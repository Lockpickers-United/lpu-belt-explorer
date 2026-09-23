import path from 'node:path'
import {describe, expect, it, vi} from 'vitest'
import {loadRuntimeEnvironment, validEnvironments} from './runtimeEnvironment.js'

describe('loadRuntimeEnvironment', () => {
    it.each(['local', 'development', 'production'])(
        'loads the %s environment from the configured directory',
        environment => {
            const env = {NODE_ENV: environment}
            const loadEnvironment = vi.fn().mockReturnValue({parsed: {}})

            const result = loadRuntimeEnvironment({
                env,
                envDir: '/srv/lpu/app',
                loadEnvironment
            })

            expect(loadEnvironment).toHaveBeenCalledWith({
                path: path.join('/srv/lpu/app', `.env.${environment}`),
                processEnv: env,
                override: false,
                quiet: true
            })
            expect(result).toEqual({
                environment,
                envPath: path.join('/srv/lpu/app', `.env.${environment}`),
                loaded: true
            })
        }
    )

    it('defaults to local and preserves it after loading the file', () => {
        const env = {}
        const loadEnvironment = vi.fn(({processEnv}) => {
            processEnv.NODE_ENV = 'production'
            return {parsed: {NODE_ENV: 'production'}}
        })

        const result = loadRuntimeEnvironment({env, loadEnvironment, override: true})

        expect(result.environment).toBe('local')
        expect(env.NODE_ENV).toBe('local')
    })

    it('rejects environments outside the supported set before loading a file', () => {
        const loadEnvironment = vi.fn()

        expect(() => loadRuntimeEnvironment({
            env: {NODE_ENV: 'test'},
            loadEnvironment
        })).toThrowError(expect.objectContaining({code: 'runtime_environment_invalid'}))
        expect(loadEnvironment).not.toHaveBeenCalled()
        expect(validEnvironments).toEqual(new Set(['local', 'development', 'production']))
    })

    it('reports a missing environment file', () => {
        const cause = new Error('missing')

        expect(() => loadRuntimeEnvironment({
            env: {NODE_ENV: 'development'},
            envDir: '/srv/lpu/app',
            loadEnvironment: vi.fn().mockReturnValue({error: cause})
        })).toThrowError(expect.objectContaining({
            code: 'runtime_environment_file_unavailable',
            cause
        }))
    })
})
