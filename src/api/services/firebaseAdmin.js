import fs from 'node:fs'
import {createHash} from 'node:crypto'
import path from 'node:path'
import {cert, getApps, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'

const firebaseServices = new Map()
let defaultFirebaseServices

function firebaseError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function appNameForConfig(config) {
    const target = `${config.firebaseProjectId}-${config.firestoreDatabaseId}`
        .replace(/[^a-zA-Z0-9_-]/g, '-')
    const credentialKey = createHash('sha256')
        .update(config.serviceAccountPath)
        .digest('hex')
        .slice(0, 12)
    return `lpu-server-${target}-${credentialKey}`
}

function loadConfiguredServiceAccount(config) {
    let serviceAccount
    try {
        serviceAccount = JSON.parse(fs.readFileSync(config.serviceAccountPath, 'utf8'))
    } catch (cause) {
        const error = firebaseError(
            'firebase_service_account_unavailable',
            `Unable to load Firebase service account from ${config.serviceAccountPath}`
        )
        error.cause = cause
        throw error
    }

    if (serviceAccount.project_id && serviceAccount.project_id !== config.firebaseProjectId) {
        throw firebaseError(
            'firebase_project_mismatch',
            `Service account project ${serviceAccount.project_id} does not match FIREBASE_PROJECT_ID ${config.firebaseProjectId}`
        )
    }
    return serviceAccount
}

export function getFirebaseAdminServices(config) {
    const cacheKey = `${config.firebaseProjectId}:${config.firestoreDatabaseId}:${config.serviceAccountPath}`
    if (firebaseServices.has(cacheKey)) return firebaseServices.get(cacheKey)

    const appName = appNameForConfig(config)
    let app = getApps().find(existingApp => existingApp.name === appName)
    if (!app) {
        app = initializeApp({
            credential: cert(loadConfiguredServiceAccount(config)),
            projectId: config.firebaseProjectId
        }, appName)
    }

    const db = config.firestoreDatabaseId === '(default)'
        ? getFirestore(app)
        : getFirestore(app, config.firestoreDatabaseId)
    db.settings({ignoreUndefinedProperties: true})

    const services = Object.freeze({
        app,
        db,
        auth: getAuth(app)
    })
    firebaseServices.set(cacheKey, services)
    return services
}

function requiredEnvironmentValue(name) {
    const value = process.env[name]?.trim()
    if (!value) {
        throw firebaseError(
            'firebase_runtime_config_missing',
            'Missing required Firebase runtime configuration: ' + name
        )
    }
    return value
}

function getDefaultFirebaseConfig() {
    const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (!configuredPath) {
        throw firebaseError(
            'firebase_runtime_config_missing',
            'Missing required Firebase runtime configuration: FIREBASE_SERVICE_ACCOUNT_PATH'
        )
    }
    if (!path.isAbsolute(configuredPath)) {
        throw firebaseError(
            'firebase_runtime_config_invalid_path',
            'FIREBASE_SERVICE_ACCOUNT_PATH must be an absolute path'
        )
    }

    const environment = requiredEnvironmentValue('LPU_JOB_ENV')
    const firestoreDatabaseId = requiredEnvironmentValue('FIRESTORE_DATABASE_ID')
    const productionAccessRequired = environment === 'production'
        || firestoreDatabaseId === '(default)'
    if (productionAccessRequired && process.env.ALLOW_PRODUCTION_JOB !== 'true') {
        throw firebaseError(
            'firebase_runtime_production_not_allowed',
            'Production runtime or the default Firestore database requires ALLOW_PRODUCTION_JOB=true'
        )
    }

    return {
        firebaseProjectId: requiredEnvironmentValue('FIREBASE_PROJECT_ID'),
        firestoreDatabaseId,
        serviceAccountPath: path.normalize(configuredPath)
    }
}

function getDefaultFirebaseServices() {
    if (!defaultFirebaseServices) {
        defaultFirebaseServices = getFirebaseAdminServices(getDefaultFirebaseConfig())
    }
    return defaultFirebaseServices
}

export function getFirebaseAdminApp() {
    return getDefaultFirebaseServices().app
}

export async function getFirestoreDb() {
    return getDefaultFirebaseServices().db
}

export async function verifyFirebaseIdToken(idToken) {
    return getDefaultFirebaseServices().auth.verifyIdToken(idToken)
}
