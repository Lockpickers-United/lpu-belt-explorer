import path from 'node:path'
import {fileURLToPath} from 'node:url'
import dotenv from 'dotenv'
import {runRedditBeltsRefresh} from './getRedditBelts.js'
import {loadRedditBeltsConfig, redditBeltsConfigSummary} from './redditBeltsConfig.js'
import isDirectRun from '../../util/isDirectRun.js'

const validEnvironmentName = /^[a-zA-Z0-9_-]+$/
const projectRootUrl = new URL('../../../', import.meta.url)

export function loadRedditBeltsEnvironment({
                                               env = process.env,
                                               loadEnvironment = dotenv.config,
                                               projectRoot = fileURLToPath(projectRootUrl)
                                           } = {}) {
    const environment = env.NODE_ENV || 'local'
    if (!validEnvironmentName.test(environment)) {
        const error = new Error('NODE_ENV contains invalid characters')
        error.code = 'reddit_belts_invalid_node_env'
        throw error
    }

    const envPath = path.resolve(projectRoot, `.env.${environment}`)
    const result = loadEnvironment({
        path: envPath,
        processEnv: env,
        quiet: true
    })

    return Object.freeze({
        environment,
        envPath,
        loaded: !result?.error
    })
}

export async function getRedditBeltsMain({
                                             env = process.env,
                                             argv = process.argv,
                                             writeOutput = console.log,
                                             logInfo = true
                                         } = {}) {
    const config = loadRedditBeltsConfig({env})
    const summary = redditBeltsConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }
    if (!config.enabled) {
        const error = new Error('Reddit belt refresh is not enabled')
        error.code = 'reddit_belts_disabled'
        throw error
    }

    return runRedditBeltsRefresh({
        scriptPath: config.scriptPath,
        credentialsPath: config.credentialsPath,
        outputDir: config.outputDir,
        pythonExecutable: config.pythonExecutable,
        timeoutMs: config.timeoutMs,
        maxOutputBytes: config.maxOutputBytes,
        logInfo,
    })
}

export async function runRedditBeltsCli(options = {}) {
    loadRedditBeltsEnvironment(options)
    return getRedditBeltsMain(options)
}

if (isDirectRun(import.meta.url)) {
    await runRedditBeltsCli({logInfo: false})
}
