import path from 'node:path'
import {describe, expect, it, vi} from 'vitest'
import {
    loadUpdateRaflStatsConfig,
    updateRaflStatsMain
} from './updateRaflStats.js'

describe('RAFL stats updater configuration', () => {
    it('summarizes development configuration without running the updater', async () => {
        const env = {
            NODE_ENV: 'development',
            USER: 'development-user',
            DEPRECATED_KEYS_DIR: '/srv/lpu/keys_deprecated'
        }
        const updateStatsFn = vi.fn()
        const writeOutput = vi.fn()
        const usersModuleLoader = vi.fn().mockResolvedValue({
            localUser: 'nealbayless',
            prodUser: 'dh_m5s5pf'
        })

        const summary = await updateRaflStatsMain({
            env,
            argv: ['node', 'updateRaflStats.js', '--check-config'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            updateStatsFn,
            writeOutput,
            usersModuleLoader
        })

        expect(summary).toEqual(await loadUpdateRaflStatsConfig(env, {
            usersModuleLoader
        }))
        expect(summary).toMatchObject({
            environment: 'development',
            production: true,
            credentialsPath: path.join(
                '/srv/lpu/keys_deprecated',
                'credentials.json'
            )
        })
        expect(updateStatsFn).not.toHaveBeenCalled()
        expect(writeOutput).toHaveBeenCalledWith(JSON.stringify(summary, null, 2))
    })

    it('passes the configured temporary directory to a normal run', async () => {
        const env = {
            NODE_ENV: 'local',
            USER: 'nealbayless',
            DEPRECATED_KEYS_DIR: '/srv/lpu/keys_deprecated'
        }
        const updateStatsFn = vi.fn().mockResolvedValue('complete')
        const usersModuleLoader = vi.fn().mockResolvedValue({
            localUser: 'nealbayless',
            prodUser: 'dh_m5s5pf'
        })

        await expect(updateRaflStatsMain({
            env,
            argv: ['node', 'updateRaflStats.js'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            updateStatsFn,
            usersModuleLoader
        })).resolves.toBe('complete')

        expect(updateStatsFn).toHaveBeenCalledWith({
            tempDir: '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL',
            env,
            usersModuleLoader
        })
    })
})
