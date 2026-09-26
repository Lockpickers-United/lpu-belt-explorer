import {gzipSync} from 'node:zlib'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    acquirePipelineLock,
    jobs,
    loadRunnerEnvironment,
    preflightLogAnalysisPipeline,
    runFetchAnalyzeLogs
} from './runFetchAnalyzeLogs.js'
import {fetchGodaddyLog} from '../src/projects/logAnalysis/ftpFetchGodaddy.js'
import {runLogAnalyzer} from '../src/projects/logAnalysis/lpubeltsLogAnalyzer.js'
import {runLogDataProcessor} from '../src/projects/logAnalysis/lpubeltsLogDataProcessor.js'
import {
    loadLogAnalysisConfig,
    logAnalysisConfigSummary
} from '../src/projects/logAnalysis/logAnalysisConfig.js'

const projectRoot = path.resolve(import.meta.dirname, '..')
const temporaryDirectories = []

async function temporaryDirectory(label) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), label))
    temporaryDirectories.push(directory)
    return directory
}

function pipelineEnv(root) {
    return {
        NODE_ENV: 'local',
        LPU_JOB_ENV: 'local',
        ALLOW_PRODUCTION_JOB: 'false',
        LOG_ANALYSIS_FTP_ENABLED: 'true',
        LOG_ANALYSIS_FTP_HOST: 'ftp.example.test',
        LOG_ANALYSIS_FTP_USER: 'test-user',
        LOG_ANALYSIS_FTP_PASSWORD: 'test-password',
        LOG_ANALYSIS_LOGS_DIR: path.join(root, 'logs'),
        LOG_ANALYSIS_DAILY_DATA_DIR: path.join(root, 'daily'),
        LOG_ANALYSIS_OUTPUT_DIR: path.join(root, 'output'),
        LPU_CATALOG_SOURCE: 'filesystem',
        LPU_CATALOG_DIR: path.join(root, 'catalog')
    }
}

afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

describe('log fetch and analysis runner', () => {
    it('loads the root environment without replacing shell values', () => {
        const env = {NODE_ENV: 'development', LOG_ANALYSIS_LOGS_DIR: '/shell/logs'}
        const loadEnvironment = vi.fn(({processEnv}) => {
            processEnv.LOG_ANALYSIS_LOGS_DIR ||= '/file/logs'
            processEnv.LOG_ANALYSIS_DAILY_DATA_DIR = '/file/daily'
            return {parsed: {}}
        })

        const result = loadRunnerEnvironment({env, loadEnvironment})

        expect(loadEnvironment).toHaveBeenCalledWith({
            path: path.join(projectRoot, '.env.development'),
            processEnv: result.childEnv,
            override: false,
            quiet: true
        })
        expect(result.childEnv.LOG_ANALYSIS_LOGS_DIR).toBe('/shell/logs')
        expect(env.LOG_ANALYSIS_DAILY_DATA_DIR).toBeUndefined()
    })

    it('runs each ESM component in order and always releases its lock', async () => {
        const root = await temporaryDirectory('log-runner-')
        const env = pipelineEnv(root)
        const runJobFn = vi.fn().mockResolvedValue(undefined)
        const releaseLock = vi.fn()

        await runFetchAnalyzeLogs({
            env,
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            preflightFn: vi.fn().mockResolvedValue({config: {dailyDataDir: env.LOG_ANALYSIS_DAILY_DATA_DIR}}),
            acquireLockFn: vi.fn().mockResolvedValue(releaseLock),
            runJobFn,
            writeOutput: vi.fn()
        })

        expect(runJobFn.mock.calls.map(call => call[0])).toEqual(jobs)
        expect(runJobFn.mock.calls.every(call => call[1] !== env)).toBe(true)
        expect(releaseLock).toHaveBeenCalledOnce()

        runJobFn.mockRejectedValueOnce(new Error('analysis failed'))
        await expect(runFetchAnalyzeLogs({
            env,
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            preflightFn: vi.fn().mockResolvedValue({config: {dailyDataDir: env.LOG_ANALYSIS_DAILY_DATA_DIR}}),
            acquireLockFn: vi.fn().mockResolvedValue(releaseLock),
            runJobFn,
            writeOutput: vi.fn()
        })).rejects.toThrow('analysis failed')
        expect(releaseLock).toHaveBeenCalledTimes(2)
    })

    it('checks its configuration and every component configuration', async () => {
        const root = await temporaryDirectory('log-runner-config-')
        const runJobFn = vi.fn().mockResolvedValue(undefined)
        const preflightFn = vi.fn()
        const acquireLockFn = vi.fn()

        const summary = await runFetchAnalyzeLogs({
            env: pipelineEnv(root),
            argv: ['node', 'runFetchAnalyzeLogs.js', '--check-config'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}}),
            runJobFn,
            preflightFn,
            acquireLockFn,
            writeOutput: vi.fn()
        })

        expect(summary.jobs).toHaveLength(jobs.length)
        expect(runJobFn.mock.calls.map(call => call[0])).toEqual(jobs)
        runJobFn.mock.calls.forEach(call => {
            expect(call[2]).toEqual(['--check-config'])
        })
        expect(preflightFn).not.toHaveBeenCalled()
        expect(acquireLockFn).not.toHaveBeenCalled()
    })

    it('redacts FTP credentials from configuration summaries', async () => {
        const root = await temporaryDirectory('log-config-')
        const config = loadLogAnalysisConfig(pipelineEnv(root))
        const summary = logAnalysisConfigSummary(config)

        expect(summary.ftp).toMatchObject({
            userConfigured: true,
            passwordConfigured: true
        })
        expect(JSON.stringify(summary)).not.toContain('test-password')
        expect(JSON.stringify(summary)).not.toContain('test-user')
    })

    it('requires explicit authorization for production paths', async () => {
        const root = await temporaryDirectory('log-production-config-')
        const env = {...pipelineEnv(root), LPU_JOB_ENV: 'production'}

        expect(() => loadLogAnalysisConfig(env)).toThrow(
            'Production log analysis requires ALLOW_PRODUCTION_JOB=true'
        )
        expect(loadLogAnalysisConfig({...env, ALLOW_PRODUCTION_JOB: 'true'}))
            .toMatchObject({jobEnvironment: 'production', productionAccessEnabled: true})
    })

    it('prevents overlapping runs and releases the pipeline lock', async () => {
        const dailyDataDir = await temporaryDirectory('log-lock-')
        const release = await acquirePipelineLock(dailyDataDir)
        await expect(acquirePipelineLock(dailyDataDir)).rejects.toMatchObject({
            code: 'log_analysis_pipeline_locked'
        })
        await release()
        const releaseNext = await acquirePipelineLock(dailyDataDir)
        await releaseNext()
    })

    it('validates catalog input and prepares pipeline directories before fetching', async () => {
        const root = await temporaryDirectory('log-preflight-')
        const env = pipelineEnv(root)
        await fs.mkdir(env.LPU_CATALOG_DIR)
        await fs.writeFile(
            path.join(env.LPU_CATALOG_DIR, 'data.json'),
            '[{"id":"lock-1"}]'
        )

        await expect(preflightLogAnalysisPipeline(env)).resolves.toMatchObject({
            config: {logsDir: env.LOG_ANALYSIS_LOGS_DIR},
            catalogConfig: {source: 'filesystem'}
        })
        await Promise.all([
            fs.access(env.LOG_ANALYSIS_LOGS_DIR),
            fs.access(env.LOG_ANALYSIS_DAILY_DATA_DIR),
            fs.access(env.LOG_ANALYSIS_OUTPUT_DIR)
        ])
    })
})

describe('log analysis components', () => {
    it('downloads and decompresses the current monthly log without shell commands', async () => {
        const logsDir = await temporaryDirectory('log-fetch-')
        const client = {
            access: vi.fn().mockResolvedValue(undefined),
            cd: vi.fn().mockResolvedValue(undefined),
            downloadTo: vi.fn(async destination => {
                await fs.writeFile(destination, gzipSync('downloaded log\n'))
            }),
            close: vi.fn()
        }

        const result = await fetchGodaddyLog({
            logsDir,
            ftpConfig: {
                host: 'ftp.example.test',
                port: 21,
                user: 'user',
                password: 'password',
                remoteDir: '/logs',
                secure: false
            },
            now: () => new Date('2026-09-24T12:00:00Z'),
            clientFactory: () => client
        })

        await expect(fs.readFile(result.outputFile, 'utf8')).resolves.toBe('downloaded log\n')
        expect(client.downloadTo).toHaveBeenCalledWith(
            expect.stringContaining('.tmp-'),
            'images.lpubelts.com-ssl_log-Sep-2026.gz'
        )
        expect(client.close).toHaveBeenCalledOnce()
    })

    it('writes newly analyzed daily data atomically', async () => {
        const root = await temporaryDirectory('log-analyzer-')
        const logsDir = path.join(root, 'logs')
        const dailyDataDir = path.join(root, 'daily')
        await fs.mkdir(logsDir)
        await fs.writeFile(
            path.join(logsDir, 'images.lpubelts.com-ssl_log-Sep-2026'),
            '203.0.113.10 - - [23/Sep/2026:12:00:00 -0400] "GET /i/clear.gif?id=abc HTTP/1.1" 200 1 "-" "Mozilla/5.0"\n'
        )

        const result = await runLogAnalyzer({
            logsDir,
            dailyDataDir,
            now: () => new Date('2026-09-24T12:00:00Z')
        })

        expect(result.processedDates).toEqual(['2026-09-23'])
        const files = await fs.readdir(dailyDataDir)
        expect(files).toEqual(['2026-09-23_1200-1200.json'])
        const day = JSON.parse(await fs.readFile(path.join(dailyDataDir, files[0]), 'utf8'))
        expect(day).toMatchObject({date: '2026-09-23', logEntries: 1, visitors: 1})
    })

    it('publishes aggregate site statistics with injected catalog details', async () => {
        const root = await temporaryDirectory('log-processor-')
        const dailyDataDir = path.join(root, 'daily')
        const outputDir = path.join(root, 'output')
        await fs.mkdir(dailyDataDir)
        await fs.writeFile(path.join(dailyDataDir, '2026-09-23_1200-1200.json'), JSON.stringify({
            date: '2026-09-23',
            visits: 1,
            visitors: 1,
            logEntries: 1,
            lockViewsById: {abc: 2},
            visitsByCountry: {US: 1}
        }))

        const result = await runLogDataProcessor({
            dailyDataDir,
            outputDir,
            catalogConfig: {},
            now: () => new Date('2026-09-24T12:00:00Z'),
            lockDetailsLoader: vi.fn().mockResolvedValue({abc: {belt: 'Green'}})
        })

        const published = JSON.parse(await fs.readFile(result.outputFile, 'utf8'))
        expect(published.metadata.updatedDateTime).toBeTruthy()
        expect(published.lockViewsByBelt.data).toEqual([
            {id: 'Green', label: 'Green', value: 1}
        ])
    })
})
