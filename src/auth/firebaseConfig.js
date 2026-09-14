const defaultProjectId = 'lpu-belt-explorer'

export function createFirebaseConfig(environment = {}) {
    const projectId = environment.VITE_FIREBASE_PROJECT_ID || defaultProjectId

    return {
        apiKey: environment.VITE_FIREBASE_API_KEY,
        authDomain: environment.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: environment.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
        messagingSenderId: environment.VITE_FIREBASE_MESSAGING_SENDER_ID || '1004257270920',
        appId: environment.VITE_FIREBASE_APP_ID || '1:1004257270920:web:ba605e14f98e926a1e533d'
    }
}

export function getFirestoreDatabaseId(environment = {}) {
    return environment.VITE_DEV_FIRESTORE === 'true' ? 'lpubelts-dev' : undefined
}

export function getFirebaseEmulatorConfig(environment = {}) {
    if (environment.VITE_USE_FIREBASE_EMULATORS !== 'true') return null

    return {
        authUrl: `http://${environment.VITE_AUTH_EMULATOR_HOST}:${environment.VITE_AUTH_EMULATOR_PORT}`,
        firestoreHost: environment.VITE_FIRESTORE_EMULATOR_HOST,
        firestorePort: Number(environment.VITE_FIRESTORE_EMULATOR_PORT)
    }
}
