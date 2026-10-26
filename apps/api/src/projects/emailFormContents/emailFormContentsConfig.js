const validEnvironments = new Set(['local', 'development', 'production'])

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function parseEnabled(env) {
    const value = env.EMAIL_FORM_ENABLED?.trim().toLowerCase()
    if (!value || value === 'false') return false
    if (value === 'true') return true
    throw configurationError(
        'email_form_config_invalid_enabled',
        'EMAIL_FORM_ENABLED must be true or false'
    )
}

function requiredEnvironment(env) {
    const environment = env.LPU_JOB_ENV?.trim()
    if (!environment) {
        throw configurationError(
            'email_form_config_missing',
            'Missing required email-form configuration: LPU_JOB_ENV'
        )
    }
    if (!validEnvironments.has(environment)) {
        throw configurationError(
            'email_form_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }
    return environment
}

export function loadEmailFormConfig({env = process.env} = {}) {
    const enabled = parseEnabled(env)
    const runtimeEnvironment = env.NODE_ENV || 'local'
    if (!enabled) {
        return Object.freeze({
            enabled,
            environment: env.LPU_JOB_ENV?.trim() || null,
            runtimeEnvironment,
            productionAccessEnabled: false
        })
    }

    const environment = requiredEnvironment(env)
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (environment === 'production' && !productionAccessEnabled) {
        throw configurationError(
            'email_form_production_not_allowed',
            'Production email-form handling requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    return Object.freeze({
        enabled,
        environment,
        runtimeEnvironment,
        productionAccessEnabled
    })
}

export function emailFormConfigSummary(config) {
    return {
        enabled: config.enabled,
        environment: config.environment,
        runtimeEnvironment: config.runtimeEnvironment,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
