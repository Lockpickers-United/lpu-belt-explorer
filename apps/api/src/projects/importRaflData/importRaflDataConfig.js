import path from 'node:path'

const validEnvironments = new Set(['local', 'development', 'production'])

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function parseEnabled(env) {
    const value = env.RAFL_PREVIEW_ENABLED?.trim().toLowerCase()
    if (!value || value === 'false') return false
    if (value === 'true') return true
    throw configurationError(
        'rafl_preview_config_invalid_enabled',
        'RAFL_PREVIEW_ENABLED must be true or false'
    )
}

function requiredValue(env, name) {
    const value = env[name]?.trim()
    if (!value) {
        throw configurationError(
            'rafl_preview_config_missing',
            `Missing required RAFL preview configuration: ${name}`
        )
    }
    return value
}

function requiredAbsolutePath(env, name) {
    const value = requiredValue(env, name)
    if (!path.isAbsolute(value)) {
        throw configurationError(
            'rafl_preview_config_invalid_path',
            `${name} must be an absolute path`
        )
    }
    return path.normalize(value)
}

function getTimeoutMs(env) {
    const timeoutMs = Number(env.RAFL_PREVIEW_TIMEOUT_MS ?? 15_000)
    if (!Number.isFinite(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 60_000) {
        throw configurationError(
            'rafl_preview_config_invalid_timeout',
            'RAFL_PREVIEW_TIMEOUT_MS must be between 1000 and 60000'
        )
    }
    return timeoutMs
}

export function loadImportRaflDataConfig({env = process.env} = {}) {
    const enabled = parseEnabled(env)
    const runtimeEnvironment = env.NODE_ENV || 'local'
    if (!enabled) {
        return Object.freeze({
            enabled,
            environment: env.LPU_JOB_ENV?.trim() || null,
            runtimeEnvironment,
            outputDir: null,
            sheetId: null,
            timeoutMs: null,
            productionAccessEnabled: false
        })
    }

    const environment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validEnvironments.has(environment)) {
        throw configurationError(
            'rafl_preview_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (environment === 'production' && !productionAccessEnabled) {
        throw configurationError(
            'rafl_preview_production_not_allowed',
            'Production RAFL preview refresh requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    const sheetId = requiredValue(env, 'RAFL_SHEET_ID')
    if (!/^[a-zA-Z0-9_-]{10,200}$/.test(sheetId)) {
        throw configurationError(
            'rafl_preview_config_invalid_sheet_id',
            'RAFL_SHEET_ID has an invalid format'
        )
    }

    return Object.freeze({
        enabled,
        environment,
        runtimeEnvironment,
        outputDir: requiredAbsolutePath(env, 'RAFL_PREVIEW_OUTPUT_DIR'),
        sheetId,
        timeoutMs: getTimeoutMs(env),
        productionAccessEnabled
    })
}

export function importRaflDataConfigSummary(config) {
    return {
        enabled: config.enabled,
        environment: config.environment,
        runtimeEnvironment: config.runtimeEnvironment,
        outputDir: config.outputDir,
        sheetConfigured: Boolean(config.sheetId),
        timeoutMs: config.timeoutMs,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
