import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {describe, expect, it, vi} from 'vitest'
import {
    jobs,
    loadRunnerEnvironment,
    runCollectionExportAnalysis
} from './runCollectionExportAnalysis.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('collection export and analysis runner', () => {
    it('loads the root environment without replacing shell values', () => {
        const env = {NODE_ENV: 'development', COLLECTION_EXPORT_DIR: '/shell/exports'}
        const loadEnvironment = vi.fn(({processEnv, override}) => {
            if (override || !processEnv.COLLECTION_EXPORT_DIR) {
                processEnv.COLLECTION_EXPORT_DIR = '/file/exports'
            }
            processEnv.COLLECTION_BACKUP_DIR = '/file/backups'
            return {parsed: {}}
        })

        const result = loadRunnerEnvironment({env, loadEnvironment})

        expect(loadEnvironment).toHaveBeenCalledWith({
            path: path.join(projectRoot, '.env.development'),
            processEnv: result.childEnv,
            override: false,
            quiet: true
        })
        expect(result.childEnv.COLLECTION_EXPORT_DIR).toBe('/shell/exports')
        expect(result.childEnv.COLLECTION_BACKUP_DIR).toBe('/file/backups')
        expect(env.COLLECTION_BACKUP_DIR).toBeUndefined()
    })

    it('runs each job in order with the shared root environment', async () => {
        const runJobFn = vi.fn().mockResolvedValue(undefined)
        const writeOutput = vi.fn()

        await runCollectionExportAnalysis({
            env: {NODE_ENV: 'development'},
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            runJobFn,
            writeOutput
        })

        expect(runJobFn).toHaveBeenCalledTimes(jobs.length)
        jobs.forEach((job, index) => {
            expect(runJobFn.mock.calls[index][0]).toBe(job)
            expect(runJobFn.mock.calls[index][1]).toMatchObject({NODE_ENV: 'development'})
            expect(runJobFn.mock.calls[index][2]).toEqual([])
        })
        expect(writeOutput).toHaveBeenCalledWith(
            `Loaded configuration from ${path.join(projectRoot, '.env.development')}`
        )
        expect(jobs.at(-2).script).toBe(
            path.join(projectRoot, 'src/projects/collections/discordBeltCountsDownload.js')
        )
        expect(jobs.at(-1).script).toBe(
            path.join(projectRoot, 'src/projects/collections/exportAllProcessor.js')
        )
    })

    it('forwards cron mode to every job and suppresses runner progress output', async () => {
        const runJobFn = vi.fn().mockResolvedValue(undefined)
        const writeOutput = vi.fn()

        await runCollectionExportAnalysis({
            env: {NODE_ENV: 'development'},
            argv: ['node', 'runCollectionExportAnalysis.js', 'cron'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            runJobFn,
            writeOutput
        })

        expect(runJobFn).toHaveBeenCalledTimes(jobs.length)
        runJobFn.mock.calls.forEach(call => {
            expect(call[2]).toEqual(['cron'])
        })
        expect(writeOutput).not.toHaveBeenCalled()
    })
})
