import path from 'node:path'
import {describe, expect, it, vi} from 'vitest'
import {
    loadUpdateRaflStatsConfig,
    updateRaflStatsMain
} from './updateRaflStats.js'

describe('RAFL stats updater configuration', () => {
    it('summarizes development configuration without running the updater', async () => {
        const env = {NODE_ENV: 'development', USER: 'development-user'}
        const updateStatsFn = vi.fn()
        const writeOutput = vi.fn()

        const summary = await updateRaflStatsMain({
            env,
            argv: ['node', 'updateRaflStats.js', '--check-config'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            updateStatsFn,
            writeOutput
        })

        expect(summary).toEqual(loadUpdateRaflStatsConfig(env))
        expect(summary).toMatchObject({
            environment: 'development',
            production: true,
            credentialsPath: path.join(
                '/home/dh_m5s5pf/explore-lpubelts-com-node/keys',
                'credentials.json'
            )
        })
        expect(updateStatsFn).not.toHaveBeenCalled()
        expect(writeOutput).toHaveBeenCalledWith(JSON.stringify(summary, null, 2))
    })

    it('passes the configured temporary directory to a normal run', async () => {
        const env = {NODE_ENV: 'local', USER: 'nealbayless'}
        const updateStatsFn = vi.fn().mockResolvedValue('complete')

        await expect(updateRaflStatsMain({
            env,
            argv: ['node', 'updateRaflStats.js'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            updateStatsFn
        })).resolves.toBe('complete')

        expect(updateStatsFn).toHaveBeenCalledWith({
            tempDir: '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL'
        })
    })
})
