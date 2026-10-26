import path from 'node:path'
import dotenv from 'dotenv'

export const validEnvironments = new Set(['local', 'development', 'production'])

function environmentError(code, message, cause) {
    const error = new Error(message, cause ? {cause} : undefined)
    error.code = code
    return error
}

export function loadRuntimeEnvironment({
    env = process.env,
    envDir = process.cwd(),
    loadEnvironment = dotenv.config,
    override = false
} = {}) {
    const environment = (env.NODE_ENV || 'local').trim()
    if (!validEnvironments.has(environment)) {
        throw environmentError(
            'runtime_environment_invalid',
            'NODE_ENV must be local, development or production'
        )
    }

    const envPath = path.resolve(envDir, `.env.${environment}`)
    const result = loadEnvironment({
        path: envPath,
        processEnv: env,
        override,
        quiet: true
    })
    if (result?.error) {
        throw environmentError(
            'runtime_environment_file_unavailable',
            `Unable to load environment file: ${envPath}`,
            result.error
        )
    }

    env.NODE_ENV = environment
    return Object.freeze({environment, envPath, loaded: true})
}
