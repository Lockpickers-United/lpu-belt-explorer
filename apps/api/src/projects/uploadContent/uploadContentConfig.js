import path from 'node:path'

const validEnvironments = new Set(['local', 'development', 'production'])

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function requiredValue(env, name) {
    const value = env[name]?.trim()
    if (!value) {
        throw configurationError(
            'upload_content_config_missing',
            `Missing required upload-content configuration: ${name}`
        )
    }
    return value
}

function requiredAbsolutePath(env, name) {
    const value = requiredValue(env, name)
    if (!path.isAbsolute(value)) {
        throw configurationError(
            'upload_content_config_invalid_path',
            `${name} must be an absolute path`
        )
    }
    return path.normalize(value)
}

export function loadUploadContentConfig({env = process.env} = {}) {
    const environment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validEnvironments.has(environment)) {
        throw configurationError(
            'upload_content_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }

    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (environment === 'production' && !productionAccessEnabled) {
        throw configurationError(
            'upload_content_production_not_allowed',
            'Production upload handling requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    return Object.freeze({
        environment,
        runtimeEnvironment: env.NODE_ENV || 'local',
        uploadDir: requiredAbsolutePath(env, 'CONTENT_UPLOAD_DIR'),
        productionAccessEnabled
    })
}

export function uploadContentConfigSummary(config) {
    return {
        environment: config.environment,
        runtimeEnvironment: config.runtimeEnvironment,
        uploadDir: config.uploadDir,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
