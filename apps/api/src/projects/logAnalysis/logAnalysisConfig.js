import path from 'node:path'

const validJobEnvironments = new Set(['local', 'development', 'production'])

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function requiredValue(env, name) {
    const value = env[name]?.trim()
    if (!value) {
        throw configurationError(
            'log_analysis_config_missing',
            `Missing required log-analysis configuration: ${name}`
        )
    }
    return value
}

function requiredAbsolutePath(env, name) {
    const value = requiredValue(env, name)
    if (!path.isAbsolute(value)) {
        throw configurationError(
            'log_analysis_config_invalid_path',
            `${name} must be an absolute path`
        )
    }
    return path.normalize(value)
}

function enabledFlag(env, name, defaultValue = 'false') {
    const value = env[name]?.trim().toLowerCase() || defaultValue
    if (!['true', 'false'].includes(value)) {
        throw configurationError(
            'log_analysis_config_invalid_enabled',
            `${name} must be true or false`
        )
    }
    return value === 'true'
}

function boundedInteger(env, name, defaultValue, minimum, maximum) {
    const value = Number(env[name] ?? defaultValue)
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
        throw configurationError(
            'log_analysis_config_invalid_number',
            `${name} must be between ${minimum} and ${maximum}`
        )
    }
    return value
}

export function loadLogAnalysisConfig(env = process.env) {
    const jobEnvironment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validJobEnvironments.has(jobEnvironment)) {
        throw configurationError(
            'log_analysis_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (jobEnvironment === 'production' && !productionAccessEnabled) {
        throw configurationError(
            'log_analysis_production_not_allowed',
            'Production log analysis requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    const ftpEnabled = enabledFlag(env, 'LOG_ANALYSIS_FTP_ENABLED')
    const config = {
        jobEnvironment,
        productionAccessEnabled,
        logsDir: requiredAbsolutePath(env, 'LOG_ANALYSIS_LOGS_DIR'),
        dailyDataDir: requiredAbsolutePath(env, 'LOG_ANALYSIS_DAILY_DATA_DIR'),
        outputDir: requiredAbsolutePath(env, 'LOG_ANALYSIS_OUTPUT_DIR'),
        ftp: {
            enabled: ftpEnabled,
            host: null,
            port: boundedInteger(env, 'LOG_ANALYSIS_FTP_PORT', 21, 1, 65_535),
            user: null,
            password: null,
            remoteDir: env.LOG_ANALYSIS_FTP_REMOTE_DIR?.trim() || '/logs',
            secure: enabledFlag(env, 'LOG_ANALYSIS_FTP_SECURE')
        }
    }

    if (ftpEnabled) {
        config.ftp.host = requiredValue(env, 'LOG_ANALYSIS_FTP_HOST')
        config.ftp.user = requiredValue(env, 'LOG_ANALYSIS_FTP_USER')
        config.ftp.password = requiredValue(env, 'LOG_ANALYSIS_FTP_PASSWORD')
    }

    if (!config.ftp.remoteDir.startsWith('/')) {
        throw configurationError(
            'log_analysis_config_invalid_path',
            'LOG_ANALYSIS_FTP_REMOTE_DIR must be an absolute FTP path'
        )
    }

    return Object.freeze({...config, ftp: Object.freeze(config.ftp)})
}

export function logAnalysisConfigSummary(config) {
    return {
        jobEnvironment: config.jobEnvironment,
        productionAccessEnabled: config.productionAccessEnabled,
        logsDir: config.logsDir,
        dailyDataDir: config.dailyDataDir,
        outputDir: config.outputDir,
        ftp: {
            enabled: config.ftp.enabled,
            host: config.ftp.host,
            port: config.ftp.port,
            userConfigured: Boolean(config.ftp.user),
            passwordConfigured: Boolean(config.ftp.password),
            remoteDir: config.ftp.remoteDir,
            secure: config.ftp.secure
        }
    }
}
