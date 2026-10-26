import path from 'node:path'

const validEnvironments = new Set(['local', 'development', 'production'])
const defaultFirestoreDatabaseId = '(default)'

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function requiredValue(env, name) {
    const value = env[name]?.trim()
    if (!value) {
        throw configurationError(
            'request_lock_config_missing',
            `Missing required request-lock configuration: ${name}`
        )
    }
    return value
}

function requiredAbsolutePath(env, name) {
    const value = requiredValue(env, name)
    if (!path.isAbsolute(value)) {
        throw configurationError(
            'request_lock_config_invalid_path',
            `${name} must be an absolute path`
        )
    }
    return path.normalize(value)
}

function requiredHttpUrl(env, name) {
    const value = requiredValue(env, name)
    let url
    try {
        url = new URL(value)
    } catch {
        throw configurationError(
            'request_lock_config_invalid_url',
            `${name} must be a valid HTTP or HTTPS URL`
        )
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
        throw configurationError(
            'request_lock_config_invalid_url',
            `${name} must be a valid HTTP or HTTPS URL`
        )
    }
    return value.replace(/\/+$/, '')
}

export function loadRequestLockConfig({env = process.env} = {}) {
    const environment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validEnvironments.has(environment)) {
        throw configurationError(
            'request_lock_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }

    const firestoreDatabaseId = requiredValue(env, 'FIRESTORE_DATABASE_ID')
    const productionAccessRequired = environment === 'production'
        || firestoreDatabaseId === defaultFirestoreDatabaseId
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'
    if (productionAccessRequired && !productionAccessEnabled) {
        throw configurationError(
            'request_lock_production_not_allowed',
            'Production runtime or the default Firestore database requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    return Object.freeze({
        environment,
        runtimeEnvironment: env.NODE_ENV || 'local',
        firebaseProjectId: requiredValue(env, 'FIREBASE_PROJECT_ID'),
        firestoreDatabaseId,
        serviceAccountPath: requiredAbsolutePath(env, 'FIREBASE_SERVICE_ACCOUNT_PATH'),
        uploadDir: requiredAbsolutePath(env, 'REQUESTED_LOCKS_UPLOAD_DIR'),
        publicImageBaseUrl: requiredHttpUrl(env, 'REQUESTED_LOCKS_PUBLIC_URL'),
        productionAccessEnabled,
        productionData: firestoreDatabaseId === defaultFirestoreDatabaseId
    })
}

export function requestLockConfigSummary(config) {
    return {
        environment: config.environment,
        runtimeEnvironment: config.runtimeEnvironment,
        firebaseProjectId: config.firebaseProjectId,
        firestoreDatabaseId: config.firestoreDatabaseId,
        uploadDir: config.uploadDir,
        publicImageBaseUrl: config.publicImageBaseUrl,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
