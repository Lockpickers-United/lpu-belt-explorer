const validEnvironments = new Set(['local', 'development', 'production'])

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function parseEnabled(env) {
    const value = env.FLICKR_INFO_ENABLED?.trim().toLowerCase()
    if (!value || value === 'false') return false
    if (value === 'true') return true
    throw configurationError(
        'flickr_info_config_invalid_enabled',
        'FLICKR_INFO_ENABLED must be true or false'
    )
}

function requiredValue(env, name) {
    const value = env[name]?.trim()
    if (!value) {
        throw configurationError(
            'flickr_info_config_missing',
            `Missing required Flickr-info configuration: ${name}`
        )
    }
    return value
}

function boundedInteger(env, name, defaultValue, min, max) {
    const value = Number(env[name] ?? defaultValue)
    if (!Number.isInteger(value) || value < min || value > max) {
        throw configurationError(
            'flickr_info_config_invalid_number',
            `${name} must be an integer between ${min} and ${max}`
        )
    }
    return value
}

export function loadFlickrInfoConfig({env = process.env} = {}) {
    const enabled = parseEnabled(env)
    const runtimeEnvironment = env.NODE_ENV || 'local'
    if (!enabled) {
        return Object.freeze({
            enabled,
            environment: env.LPU_JOB_ENV?.trim() || null,
            runtimeEnvironment,
            apiKey: null,
            timeoutMs: null,
            maxPhotos: null,
            concurrency: null,
            productionAccessEnabled: false
        })
    }

    const environment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validEnvironments.has(environment)) {
        throw configurationError(
            'flickr_info_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (environment === 'production' && !productionAccessEnabled) {
        throw configurationError(
            'flickr_info_production_not_allowed',
            'Production Flickr-info access requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    return Object.freeze({
        enabled,
        environment,
        runtimeEnvironment,
        apiKey: requiredValue(env, 'FLICKR_API_KEY'),
        timeoutMs: boundedInteger(env, 'FLICKR_INFO_TIMEOUT_MS', 30_000, 1_000, 120_000),
        maxPhotos: boundedInteger(env, 'FLICKR_INFO_MAX_PHOTOS', 500, 1, 1_000),
        concurrency: boundedInteger(env, 'FLICKR_INFO_CONCURRENCY', 5, 1, 20),
        productionAccessEnabled
    })
}

export function flickrInfoConfigSummary(config) {
    return {
        enabled: config.enabled,
        environment: config.environment,
        runtimeEnvironment: config.runtimeEnvironment,
        apiKeyConfigured: Boolean(config.apiKey),
        timeoutMs: config.timeoutMs,
        maxPhotos: config.maxPhotos,
        concurrency: config.concurrency,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
