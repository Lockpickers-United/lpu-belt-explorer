import {createFirebaseActivityHandler} from './logFirebaseActivity.js'
import {loadFirebaseActivityConfig} from './firebaseActivityConfig.js'

let defaultRuntimePromise

function createDisabledHandler() {
    return async function firebaseActivityDisabled(_req, res) {
        return res.status(503).json({
            error: {
                code: 'firebase_activity_disabled',
                message: 'Firebase activity logging is not enabled'
            }
        })
    }
}

export async function createFirebaseActivityRuntime({env = process.env} = {}) {
    const config = loadFirebaseActivityConfig({env})
    if (!config.enabled) {
        return Object.freeze({config, handler: createDisabledHandler()})
    }

    const handler = createFirebaseActivityHandler({
        productionData: config.productionData,
        maxBatchSize: config.maxBatchSize,
        maxStringLength: config.maxStringLength
    })
    return Object.freeze({config, handler})
}

export async function getDefaultFirebaseActivityHandler() {
    if (!defaultRuntimePromise) defaultRuntimePromise = createFirebaseActivityRuntime()
    return (await defaultRuntimePromise).handler
}
