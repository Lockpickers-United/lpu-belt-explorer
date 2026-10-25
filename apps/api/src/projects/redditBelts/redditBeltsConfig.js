import path from 'node:path'

const validEnvironments = new Set(['local', 'development', 'production'])

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function parseEnabled(env) {
    const value = env.REDDIT_BELTS_ENABLED?.trim().toLowerCase()
    if (!value || value === 'false') return false
    if (value === 'true') return true
    throw configurationError(
        'reddit_belts_config_invalid_enabled',
        'REDDIT_BELTS_ENABLED must be true or false'
    )
}

function requiredValue(env, name) {
    const value = env[name]?.trim()
    if (!value) {
        throw configurationError(
            'reddit_belts_config_missing',
            `Missing required Reddit belts configuration: ${name}`
        )
    }
    return value
}

function requiredAbsolutePath(env, name) {
    const value = requiredValue(env, name)
    if (!path.isAbsolute(value)) {
        throw configurationError(
            'reddit_belts_config_invalid_path',
            `${name} must be an absolute path`
        )
    }
    return path.normalize(value)
}

function boundedNumber(env, name, defaultValue, min, max) {
    const value = Number(env[name] ?? defaultValue)
    if (!Number.isInteger(value) || value < min || value > max) {
        throw configurationError(
            'reddit_belts_config_invalid_number',
            `${name} must be between ${min} and ${max}`
        )
    }
    return value
}

export function loadRedditBeltsConfig({env = process.env} = {}) {
    const enabled = parseEnabled(env)
    const runtimeEnvironment = env.NODE_ENV || 'local'
    if (!enabled) {
        return Object.freeze({
            enabled,
            environment: env.LPU_JOB_ENV?.trim() || null,
            runtimeEnvironment,
            scriptPath: null,
            credentialsPath: null,
            outputDir: null,
            pythonExecutable: null,
            timeoutMs: null,
            maxOutputBytes: null,
            productionAccessEnabled: false
        })
    }

    const environment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validEnvironments.has(environment)) {
        throw configurationError(
            'reddit_belts_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (environment === 'production' && !productionAccessEnabled) {
        throw configurationError(
            'reddit_belts_production_not_allowed',
            'Production Reddit belt refresh requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    return Object.freeze({
        enabled,
        environment,
        runtimeEnvironment,
        scriptPath: requiredAbsolutePath(env, 'REDDIT_BELTS_SCRIPT_PATH'),
        credentialsPath: requiredAbsolutePath(env, 'REDDIT_CREDENTIALS_PATH'),
        outputDir: requiredAbsolutePath(env, 'REDDIT_BELTS_OUTPUT_DIR'),
        pythonExecutable: env.REDDIT_BELTS_PYTHON_EXECUTABLE?.trim() || 'python3',
        timeoutMs: boundedNumber(env, 'REDDIT_BELTS_TIMEOUT_MS', 120_000, 1_000, 300_000),
        maxOutputBytes: boundedNumber(
            env,
            'REDDIT_BELTS_MAX_OUTPUT_BYTES',
            10 * 1024 * 1024,
            1_024,
            50 * 1024 * 1024
        ),
        productionAccessEnabled
    })
}

export function redditBeltsConfigSummary(config) {
    return {
        enabled: config.enabled,
        environment: config.environment,
        runtimeEnvironment: config.runtimeEnvironment,
        scriptPath: config.scriptPath,
        credentialsConfigured: Boolean(config.credentialsPath),
        outputDir: config.outputDir,
        pythonExecutable: config.pythonExecutable,
        timeoutMs: config.timeoutMs,
        maxOutputBytes: config.maxOutputBytes,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
