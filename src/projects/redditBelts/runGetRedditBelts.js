import {runRedditBeltsRefresh} from './getRedditBelts.js'
import {loadRedditBeltsConfig, redditBeltsConfigSummary} from './redditBeltsConfig.js'
import isDirectRun from '../../util/isDirectRun.js'

export async function getRedditBeltsMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log
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
        maxOutputBytes: config.maxOutputBytes
    })
}

if (isDirectRun(import.meta.url)) {
    await getRedditBeltsMain()
}
