import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    jobs,
    acquirePipelineLock,
    loadRunnerEnvironment,
    preflightCollectionPipeline,
    runCollectionExportAnalysis,
    selectJobs
} from './runCollectionExportAnalysis.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const temporaryDirectories = []

afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

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
            preflightFn: vi.fn().mockResolvedValue({exportConfig: {exportDir: '/exports'}}),
            acquireLockFn: vi.fn().mockResolvedValue(vi.fn()),
            writeOutput
        })

        const selectedJobs = selectJobs({})
        expect(runJobFn).toHaveBeenCalledTimes(selectedJobs.length)
        selectedJobs.forEach((job, index) => {
            expect(runJobFn.mock.calls[index][0]).toBe(job)
            expect(runJobFn.mock.calls[index][1]).toMatchObject({NODE_ENV: 'development'})
            expect(runJobFn.mock.calls[index][2]).toEqual([])
        })
        expect(writeOutput).toHaveBeenCalledWith(
            `Loaded configuration from ${path.join(projectRoot, '.env.development')}`
        )
        expect(selectedJobs.at(-1).script).toBe(
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
            preflightFn: vi.fn().mockResolvedValue({exportConfig: {exportDir: '/exports'}}),
            acquireLockFn: vi.fn().mockResolvedValue(vi.fn()),
            writeOutput
        })

        expect(runJobFn).toHaveBeenCalledTimes(selectJobs({}).length)
        runJobFn.mock.calls.forEach(call => {
            expect(call[2]).toEqual(['cron'])
        })
        expect(writeOutput).not.toHaveBeenCalled()
    })

    it('checks its configuration and every component configuration', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'collection-runner-config-'))
        temporaryDirectories.push(root)
        const runJobFn = vi.fn().mockResolvedValue(undefined)
        const preflightFn = vi.fn()
        const acquireLockFn = vi.fn()

        const summary = await runCollectionExportAnalysis({
            env: {
                NODE_ENV: 'development',
                LPU_JOB_ENV: 'development',
                FIREBASE_PROJECT_ID: 'test-project',
                FIRESTORE_DATABASE_ID: 'test-database',
                FIREBASE_SERVICE_ACCOUNT_PATH: path.join(root, 'service-account.json'),
                COLLECTION_EXPORT_DIR: path.join(root, 'exports'),
                COLLECTION_BACKUP_DIR: path.join(root, 'backups'),
                COLLECTION_PUBLIC_DATA_DIR: path.join(root, 'public'),
                COLLECTION_DAILY_DIR: path.join(root, 'daily'),
                COLLECTION_API_DIR: path.join(root, 'api'),
                LPU_CATALOG_SOURCE: 'filesystem',
                LPU_CATALOG_DIR: path.join(root, 'catalog'),
                LPU_CATALOG_REFRESH_ENABLED: 'false',
                REDDIT_BELTS_ENABLED: 'false',
                DISCORD_BELT_COUNTS_REFRESH_ENABLED: 'false'
            },
            argv: ['node', 'runCollectionExportAnalysis.js', '--check-config'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            runJobFn,
            preflightFn,
            acquireLockFn,
            writeOutput: vi.fn()
        })

        expect(summary.jobs).toHaveLength(selectJobs({}).length)
        expect(runJobFn.mock.calls.map(call => call[0])).toEqual(jobs)
        runJobFn.mock.calls.forEach(call => {
            expect(call[2]).toEqual(['--check-config'])
        })
        expect(preflightFn).not.toHaveBeenCalled()
        expect(acquireLockFn).not.toHaveBeenCalled()
    })

    it('includes external refresh jobs only when explicitly enabled', () => {
        const selected = selectJobs({
            LPU_CATALOG_REFRESH_ENABLED: 'true',
            REDDIT_BELTS_ENABLED: 'true',
            DISCORD_BELT_COUNTS_REFRESH_ENABLED: 'true'
        })
        expect(selected).toEqual(jobs)
        expect(selectJobs({}).map(job => job.optionalRefresh)).not.toContain('reddit')
        expect(selectJobs({}).map(job => job.optionalRefresh)).not.toContain('discord')
        expect(selectJobs({}).map(job => job.optionalRefresh)).not.toContain('catalog')
    })

    it('validates snapshot and disabled-refresh inputs before starting jobs', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'collection-runner-'))
        temporaryDirectories.push(root)
        const catalogDir = path.join(root, 'catalog')
        const publicDataDir = path.join(root, 'public')
        await fs.mkdir(catalogDir)
        await fs.mkdir(publicDataDir)
        await Promise.all([
            ...['data.json', 'rafl.json', 'dials.json', 'projects.json', 'awards.json', 'glossary.json']
                .map(filename => fs.writeFile(path.join(catalogDir, filename), '[{"id":"fixture"}]')),
            fs.writeFile(path.join(publicDataDir, 'redditBeltCounts.json'), '{"Total":1}'),
            fs.writeFile(path.join(publicDataDir, 'discordBeltCounts.json'), '{"Total":1}')
        ])
        const env = {
            LPU_JOB_ENV: 'development',
            FIREBASE_PROJECT_ID: 'test-project',
            FIRESTORE_DATABASE_ID: 'test-database',
            FIREBASE_SERVICE_ACCOUNT_PATH: path.join(root, 'service-account.json'),
            COLLECTION_EXPORT_DIR: path.join(root, 'exports'),
            COLLECTION_BACKUP_DIR: path.join(root, 'backups'),
            COLLECTION_PUBLIC_DATA_DIR: publicDataDir,
            COLLECTION_DAILY_DIR: path.join(root, 'daily'),
            COLLECTION_API_DIR: path.join(root, 'api'),
            LPU_CATALOG_SOURCE: 'filesystem',
            LPU_CATALOG_DIR: catalogDir,
            LPU_CATALOG_REFRESH_ENABLED: 'false',
            REDDIT_BELTS_ENABLED: 'false',
            DISCORD_BELT_COUNTS_REFRESH_ENABLED: 'false'
        }

        await expect(preflightCollectionPipeline(env)).resolves.toMatchObject({
            redditConfig: {enabled: false},
            discordConfig: {enabled: false}
        })

        await fs.rm(path.join(publicDataDir, 'redditBeltCounts.json'))
        await expect(preflightCollectionPipeline(env))
            .rejects.toThrow(/required pipeline input Reddit belt counts/)
    })

    it('runs catalog refresh first when explicitly enabled', () => {
        const selected = selectJobs({LPU_CATALOG_REFRESH_ENABLED: 'true'})
        expect(selected[0]).toMatchObject({optionalRefresh: 'catalog'})
    })

    it.each(['filesystem', 'remote'])(
        'permits an enabled catalog refresh when the catalog source is %s',
        async catalogSource => {
            const root = await fs.mkdtemp(path.join(os.tmpdir(), 'collection-catalog-refresh-'))
            temporaryDirectories.push(root)
            const publicDataDir = path.join(root, 'public')
            await fs.mkdir(publicDataDir)
            await Promise.all([
                fs.writeFile(path.join(publicDataDir, 'redditBeltCounts.json'), '{"Total":1}'),
                fs.writeFile(path.join(publicDataDir, 'discordBeltCounts.json'), '{"Total":1}')
            ])

            await expect(preflightCollectionPipeline({
                LPU_JOB_ENV: 'development',
                FIREBASE_PROJECT_ID: 'test-project',
                FIRESTORE_DATABASE_ID: 'test-database',
                FIREBASE_SERVICE_ACCOUNT_PATH: path.join(root, 'service-account.json'),
                COLLECTION_EXPORT_DIR: path.join(root, 'exports'),
                COLLECTION_BACKUP_DIR: path.join(root, 'backups'),
                COLLECTION_PUBLIC_DATA_DIR: publicDataDir,
                COLLECTION_DAILY_DIR: path.join(root, 'daily'),
                COLLECTION_API_DIR: path.join(root, 'api'),
                LPU_CATALOG_SOURCE: catalogSource,
                LPU_CATALOG_REFRESH_ENABLED: 'true',
                LPU_CATALOG_DIR: path.join(root, 'missing-snapshots'),
                LPU_CATALOG_BASE_URL: 'https://catalog.example',
                REDDIT_BELTS_ENABLED: 'false',
                DISCORD_BELT_COUNTS_REFRESH_ENABLED: 'false'
            })).resolves.toMatchObject({
                catalogConfig: {source: catalogSource},
                catalogRefreshConfig: {enabled: true}
            })
        }
    )

    it('prevents overlapping runs and releases the lock after use', async () => {
        const exportDir = await fs.mkdtemp(path.join(os.tmpdir(), 'collection-runner-lock-'))
        temporaryDirectories.push(exportDir)

        const release = await acquirePipelineLock(exportDir)
        await expect(acquirePipelineLock(exportDir)).rejects.toMatchObject({
            code: 'collection_pipeline_locked'
        })
        await release()

        const releaseNext = await acquirePipelineLock(exportDir)
        await releaseNext()
    })

    it('releases the pipeline lock when a child job fails', async () => {
        const releaseLock = vi.fn()
        await expect(runCollectionExportAnalysis({
            env: {NODE_ENV: 'development'},
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            preflightFn: vi.fn().mockResolvedValue({exportConfig: {exportDir: '/exports'}}),
            acquireLockFn: vi.fn().mockResolvedValue(releaseLock),
            runJobFn: vi.fn().mockRejectedValue(new Error('job failed')),
            writeOutput: vi.fn()
        })).rejects.toThrow('job failed')
        expect(releaseLock).toHaveBeenCalledOnce()
    })
})
