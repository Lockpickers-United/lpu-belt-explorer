import fs from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {cert, getApps, initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {defaultFirestoreDatabaseId} from './exportJobConfig.js'

const firestoreClients = new Map()

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
    return `lpu-export-${target}-${credentialKey}`
}

async function loadServiceAccount(config) {
    let serviceAccount
    try {
        serviceAccount = JSON.parse(await fs.readFile(config.serviceAccountPath, 'utf8'))
    } catch (cause) {
        const error = firebaseError(
            'export_job_service_account_unavailable',
            `Unable to load Firebase service account from ${config.serviceAccountPath}`
        )
        error.cause = cause
        throw error
    }

    if (serviceAccount.project_id && serviceAccount.project_id !== config.firebaseProjectId) {
        throw firebaseError(
            'export_job_project_mismatch',
            `Service account project ${serviceAccount.project_id} does not match FIREBASE_PROJECT_ID ${config.firebaseProjectId}`
        )
    }
    return serviceAccount
}

export async function getExportFirestore(config) {
    const cacheKey = `${config.firebaseProjectId}:${config.firestoreDatabaseId}:${config.serviceAccountPath}`
    if (firestoreClients.has(cacheKey)) return firestoreClients.get(cacheKey)

    const appName = appNameForConfig(config)
    let firebaseApp = getApps().find(app => app.name === appName)
    if (!firebaseApp) {
        const serviceAccount = await loadServiceAccount(config)
        firebaseApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: config.firebaseProjectId
        }, appName)
    }

    const db = config.firestoreDatabaseId === defaultFirestoreDatabaseId
        ? getFirestore(firebaseApp)
        : getFirestore(firebaseApp, config.firestoreDatabaseId)
    db.settings({ignoreUndefinedProperties: true})
    firestoreClients.set(cacheKey, db)
    return db
}
