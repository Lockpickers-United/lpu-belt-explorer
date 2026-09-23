import path from 'node:path'

export const defaultFirestoreDatabaseId = '(default)'

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
            'export_job_config_missing',
            `Missing required export job configuration: ${name}`
        )
    }
    return value
}

function requiredAbsolutePath(env, name) {
    const value = requiredValue(env, name)
    if (!path.isAbsolute(value)) {
        throw configurationError(
            'export_job_config_invalid_path',
            `${name} must be an absolute path`
        )
    }
    return path.normalize(value)
}

function optionalAbsolutePath(env, name, required) {
    if (required || env[name]) return requiredAbsolutePath(env, name)
    return null
}

function getLookbackMs(env) {
    const value = Number(env.COLLECTIONS_EXPORT_LOOKBACK_MS ?? 5 * 60 * 1000)
    if (!Number.isFinite(value) || value < 0) {
        throw configurationError(
            'export_job_config_invalid_lookback',
            'COLLECTIONS_EXPORT_LOOKBACK_MS must be a non-negative number'
        )
    }
    return value
}

export function loadExportJobConfig({
    env = process.env,
    requirePublicDataDir = false,
    requireDailyDir = false,
    requireApiDir = false
} = {}) {
    const jobEnvironment = requiredValue(env, 'LPU_JOB_ENV')
    if (!validJobEnvironments.has(jobEnvironment)) {
        throw configurationError(
            'export_job_config_invalid_environment',
            'LPU_JOB_ENV must be local, development or production'
        )
    }

    const firebaseProjectId = requiredValue(env, 'FIREBASE_PROJECT_ID')
    const firestoreDatabaseId = requiredValue(env, 'FIRESTORE_DATABASE_ID')
    const productionAccessRequired = jobEnvironment === 'production'
        || firestoreDatabaseId === defaultFirestoreDatabaseId
    const productionAccessEnabled = env.ALLOW_PRODUCTION_JOB === 'true'

    if (productionAccessRequired && !productionAccessEnabled) {
        throw configurationError(
            'export_job_production_not_allowed',
            'Production output or the default Firestore database requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    const config = {
        jobEnvironment,
        firebaseProjectId,
        firestoreDatabaseId,
        serviceAccountPath: requiredAbsolutePath(env, 'FIREBASE_SERVICE_ACCOUNT_PATH'),
        exportDir: requiredAbsolutePath(env, 'COLLECTION_EXPORT_DIR'),
        backupDir: requiredAbsolutePath(env, 'COLLECTION_BACKUP_DIR'),
        publicDataDir: optionalAbsolutePath(
            env,
            'COLLECTION_PUBLIC_DATA_DIR',
            requirePublicDataDir
        ),
        dailyDir: optionalAbsolutePath(env, 'COLLECTION_DAILY_DIR', requireDailyDir),
        apiDir: optionalAbsolutePath(env, 'COLLECTION_API_DIR', requireApiDir),
        lookbackMs: getLookbackMs(env),
        productionAccessEnabled
    }

    return Object.freeze(config)
}

export function exportJobConfigSummary(config) {
    return {
        jobEnvironment: config.jobEnvironment,
        firebaseProjectId: config.firebaseProjectId,
        firestoreDatabaseId: config.firestoreDatabaseId,
        serviceAccountPath: config.serviceAccountPath,
        exportDir: config.exportDir,
        backupDir: config.backupDir,
        publicDataDir: config.publicDataDir,
        dailyDir: config.dailyDir,
        apiDir: config.apiDir,
        lookbackMs: config.lookbackMs,
        productionAccessEnabled: config.productionAccessEnabled
    }
}
