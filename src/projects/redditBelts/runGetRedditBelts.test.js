import path from 'node:path'
import {describe, expect, it, vi} from 'vitest'
import {
    loadRedditBeltsEnvironment,
    runRedditBeltsCli
} from './runGetRedditBelts.js'

const configuredEnvironment = {
    NODE_ENV: 'production',
    LPU_JOB_ENV: 'production',
    ALLOW_PRODUCTION_JOB: 'true',
    REDDIT_BELTS_ENABLED: 'true',
    REDDIT_BELTS_SCRIPT_PATH: '/srv/lpu/fetch_reddit_flairs.py',
    REDDIT_CREDENTIALS_PATH: '/srv/lpu/keys/reddit-keys.json',
    REDDIT_BELTS_OUTPUT_DIR: '/srv/lpu/public/data'
}

describe('standalone Reddit belt runner environment', () => {
    it('loads the NODE_ENV-specific file relative to the repository root', () => {
        const env = {NODE_ENV: 'production'}
        const loadEnvironment = vi.fn(({processEnv}) => {
            Object.assign(processEnv, configuredEnvironment)
            return {parsed: configuredEnvironment}
        })

        const result = loadRedditBeltsEnvironment({
            env,
            loadEnvironment,
            projectRoot: '/srv/lpu/explore-lpubelts-com-node'
        })

        expect(loadEnvironment).toHaveBeenCalledWith({
            path: path.join('/srv/lpu/explore-lpubelts-com-node', '.env.production'),
            processEnv: env,
            override: false,
            quiet: true
        })
        expect(result).toEqual({
            environment: 'production',
            envPath: path.join('/srv/lpu/explore-lpubelts-com-node', '.env.production'),
            loaded: true
        })
        expect(env.REDDIT_BELTS_ENABLED).toBe('true')
    })

    it('loads configuration before checking the standalone runner', async () => {
        const env = {NODE_ENV: 'production'}
        const writeOutput = vi.fn()
        const loadEnvironment = vi.fn(({processEnv}) => {
            Object.assign(processEnv, configuredEnvironment)
            return {parsed: configuredEnvironment}
        })

        const summary = await runRedditBeltsCli({
            env,
            argv: ['node', 'runGetRedditBelts.js', '--check-config'],
            writeOutput,
            loadEnvironment,
            projectRoot: '/srv/lpu/explore-lpubelts-com-node'
        })

        expect(summary.enabled).toBe(true)
        expect(summary.environment).toBe('production')
        expect(summary.productionAccessEnabled).toBe(true)
        expect(writeOutput).toHaveBeenCalledOnce()
    })

    it('rejects unsupported NODE_ENV values before resolving a file', () => {
        expect(() => loadRedditBeltsEnvironment({
            env: {NODE_ENV: '../../production'},
            loadEnvironment: vi.fn()
        })).toThrowError(expect.objectContaining({code: 'runtime_environment_invalid'}))
    })
})
