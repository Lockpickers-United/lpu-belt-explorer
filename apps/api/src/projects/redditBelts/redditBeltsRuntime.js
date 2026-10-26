import fs from 'node:fs/promises'
import {createGetRedditBeltsHandler} from './getRedditBelts.js'
import {loadRedditBeltsConfig} from './redditBeltsConfig.js'

let defaultRuntimePromise

function createDisabledHandler() {
    return async function redditBeltsDisabled(_req, res) {
        return res.status(503).json({
            status: 503,
            code: 'reddit_belts_disabled',
            message: 'Reddit belt refresh is not enabled'
        })
    }
}

export async function createRedditBeltsRuntime({env = process.env} = {}) {
    const config = loadRedditBeltsConfig({env})
    if (!config.enabled) {
        return Object.freeze({config, handler: createDisabledHandler()})
    }

    await fs.mkdir(config.outputDir, {recursive: true})
    const handler = createGetRedditBeltsHandler({
        runtimeEnvironment: config.runtimeEnvironment,
        scriptPath: config.scriptPath,
        credentialsPath: config.credentialsPath,
        outputDir: config.outputDir,
        pythonExecutable: config.pythonExecutable,
        timeoutMs: config.timeoutMs,
        maxOutputBytes: config.maxOutputBytes
    })
    return Object.freeze({config, handler})
}

export async function getDefaultRedditBeltsHandler() {
    if (!defaultRuntimePromise) defaultRuntimePromise = createRedditBeltsRuntime()
    return (await defaultRuntimePromise).handler
}
