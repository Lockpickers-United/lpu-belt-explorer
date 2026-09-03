import fs from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'
import {cert, getApps, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'

const currentDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(currentDir, '../../..')
const defaultServiceAccountPaths = [
    resolve(projectRoot, 'keys/service-account.json'),
    resolve(projectRoot, 'keys/lpu-belt-explorer-firebase-adminsdk.json')
]

let firebaseApp
let firestoreDb

function getServiceAccountPath() {
    const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (configuredPath) return configuredPath

    const existingPath = defaultServiceAccountPaths.find(filePath => fs.existsSync(filePath))
    if (existingPath) return existingPath

    const err = new Error('Firebase service account file not found')
    err.code = 'firebase_service_account_not_found'
    throw err
}

function loadServiceAccount() {
    return JSON.parse(fs.readFileSync(getServiceAccountPath(), 'utf8'))
}

export function getFirebaseAdminApp() {
    if (firebaseApp) return firebaseApp

    const existingApps = getApps()
    if (existingApps.length > 0) {
        firebaseApp = existingApps[0]
        return firebaseApp
    }

    firebaseApp = initializeApp({
        credential: cert(loadServiceAccount()),
        databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
    })
    return firebaseApp
}

export async function getFirestoreDb() {
    if (!firestoreDb) {
        firestoreDb = getFirestore(getFirebaseAdminApp())
        firestoreDb.settings({ignoreUndefinedProperties: true})
    }
    return firestoreDb
}

export async function verifyFirebaseIdToken(idToken) {
    return getAuth(getFirebaseAdminApp()).verifyIdToken(idToken)
}
