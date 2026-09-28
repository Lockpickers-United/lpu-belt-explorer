import path from 'node:path'
import {getTrustProxyConfig} from '../api/middleware/trustProxy.js'
import {validEnvironments} from '../util/runtimeEnvironment.js'

const collectionStatsFilename = 'collectionStatsByIdFull.json'
const lockVideosFilename = 'lockVideos.json'

function configError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function requiredValue(env, name) {
    const value = env[name]
    if (typeof value !== 'string' || !value.trim()) {
        throw configError('server_runtime_config_missing', `Missing required server configuration: ${name}`)
    }
    return value.trim()
}

function parsePort(value) {
    if (!/^\d+$/.test(value)) {
        throw configError('server_runtime_port_invalid', 'API_PORT must be an integer between 1 and 65535')
    }
    const port = Number(value)
    if (port < 1 || port > 65535) {
        throw configError('server_runtime_port_invalid', 'API_PORT must be an integer between 1 and 65535')
    }
    return port
}

function parseHost(value) {
    const host = value.trim()
    if (/\s|\//.test(host) || host.includes('://')) {
        throw configError('server_runtime_host_invalid', 'HOST must be a hostname or IP address')
    }
    return host
}

function parseCorsOrigins(value, environment) {
    if (typeof value !== 'string' || !value.trim()) {
        if (environment === 'production') {
            throw configError(
                'server_runtime_cors_missing',
                'CORS_ORIGIN is required in production'
            )
        }
        return true
    }

    const origins = value.split(',').map(origin => origin.trim()).filter(Boolean)
    if (origins.length === 0 || origins.includes('*')) {
        throw configError('server_runtime_cors_invalid', 'CORS_ORIGIN must contain exact HTTP or HTTPS origins')
    }

    for (const origin of origins) {
        let parsed
        try {
            parsed = new URL(origin)
        } catch {
            throw configError('server_runtime_cors_invalid', `Invalid CORS_ORIGIN entry: ${origin}`)
        }
        if (!['http:', 'https:'].includes(parsed.protocol)
            || parsed.origin !== origin
            || parsed.username
            || parsed.password) {
            throw configError('server_runtime_cors_invalid', `Invalid CORS_ORIGIN entry: ${origin}`)
        }
    }
    return origins
}

export function loadServerRuntimeConfig(env = process.env) {
    const environment = requiredValue(env, 'NODE_ENV')
    if (!validEnvironments.has(environment)) {
        throw configError(
            'server_runtime_environment_invalid',
            'NODE_ENV must be local, development or production'
        )
    }

    const jobEnvironment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validEnvironments.has(jobEnvironment) || jobEnvironment !== environment) {
        throw configError(
            'server_runtime_environment_mismatch',
            'LPU_JOB_ENV must match NODE_ENV for the API server'
        )
    }

    const collectionApiDir = requiredValue(env, 'COLLECTION_API_DIR')
    if (!path.isAbsolute(collectionApiDir)) {
        throw configError(
            'server_runtime_collection_api_dir_invalid',
            'COLLECTION_API_DIR must be an absolute path'
        )
    }

    return Object.freeze({
        environment,
        port: parsePort(requiredValue(env, 'API_PORT')),
        host: parseHost(requiredValue(env, 'HOST')),
        corsOrigin: parseCorsOrigins(env.CORS_ORIGIN, environment),
        trustProxy: getTrustProxyConfig(env),
        collectionApiDir: path.normalize(collectionApiDir),
        collectionStatsPath: path.join(path.normalize(collectionApiDir), collectionStatsFilename),
        lockVideosPath: path.join(path.normalize(collectionApiDir), lockVideosFilename)
    })
}
