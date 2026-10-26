import fs from 'node:fs/promises'
import {createImportRaflDataHandler} from './importRaflData.js'
import {loadImportRaflDataConfig} from './importRaflDataConfig.js'

let defaultRuntimePromise

function createDisabledHandler() {
    return async function raflPreviewDisabled(_req, res) {
        return res.status(503).json({
            status: 'Errors',
            errors: [{
                code: 'rafl_preview_disabled',
                message: 'RAFL preview refresh is not enabled'
            }]
        })
    }
}

export async function createImportRaflDataRuntime({env = process.env} = {}) {
    const config = loadImportRaflDataConfig({env})
    if (!config.enabled) {
        return Object.freeze({config, handler: createDisabledHandler()})
    }

    await fs.mkdir(config.outputDir, {recursive: true})
    const handler = createImportRaflDataHandler({
        runtimeEnvironment: config.runtimeEnvironment,
        sheetId: config.sheetId,
        outputDir: config.outputDir,
        timeoutMs: config.timeoutMs
    })
    return Object.freeze({config, handler})
}

export async function getDefaultImportRaflDataHandler() {
    if (!defaultRuntimePromise) defaultRuntimePromise = createImportRaflDataRuntime()
    return (await defaultRuntimePromise).handler
}
