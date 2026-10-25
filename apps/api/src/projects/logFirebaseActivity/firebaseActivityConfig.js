const validEnvironments = new Set(['local', 'development', 'production'])

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function parseEnabled(env) {
    const value = env.FIREBASE_ACTIVITY_LOGGING_ENABLED?.trim().toLowerCase()
    if (!value || value === 'false') return false
    if (value === 'true') return true
    throw configurationError(
        'firebase_activity_config_invalid_enabled',
        'FIREBASE_ACTIVITY_LOGGING_ENABLED must be true or false'
    )
}

function requiredEnvironment(env) {
    const environment = env.LPU_JOB_ENV?.trim()
    if (!environment) {
        throw configurationError(
            'firebase_activity_config_missing',
            'Missing required Firebase-activity configuration: LPU_JOB_ENV'
        )
    }
    if (!validEnvironments.has(environment)) {
        throw configurationError(
            'firebase_activity_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }
    return environment
}

function boundedInteger(env, name, defaultValue, min, max) {
    const value = Number(env[name] ?? defaultValue)
    if (!Number.isInteger(value) || value < min || value > max) {
        throw configurationError(
            'firebase_activity_config_invalid_number',
            `${name} must be an integer between ${min} and ${max}`
        )
    }
    return value
}

export function loadFirebaseActivityConfig({env = process.env} = {}) {
    const enabled = parseEnabled(env)
    const runtimeEnvironment = env.NODE_ENV || 'local'
    if (!enabled) {
        return Object.freeze({
            enabled,
            environment: env.LPU_JOB_ENV?.trim() || null,
            runtimeEnvironment,
            productionData: false,
            maxBatchSize: null,
            maxStringLength: null,
            productionAccessEnabled: false
        })
    }

    const environment = requiredEnvironment(env)
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (environment === 'production' && !productionAccessEnabled) {
        throw configurationError(
            'firebase_activity_production_not_allowed',
            'Production Firebase-activity logging requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    return Object.freeze({
        enabled,
        environment,
        runtimeEnvironment,
        productionData: environment === 'production',
        maxBatchSize: boundedInteger(env, 'FIREBASE_ACTIVITY_MAX_BATCH_SIZE', 100, 1, 1_000),
        maxStringLength: boundedInteger(env, 'FIREBASE_ACTIVITY_MAX_STRING_LENGTH', 500, 10, 2_000),
        productionAccessEnabled
    })
}

export function firebaseActivityConfigSummary(config) {
    return {
        enabled: config.enabled,
        environment: config.environment,
        runtimeEnvironment: config.runtimeEnvironment,
        productionData: config.productionData,
        maxBatchSize: config.maxBatchSize,
        maxStringLength: config.maxStringLength,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
