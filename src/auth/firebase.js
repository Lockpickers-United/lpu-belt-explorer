import {initializeApp} from 'firebase/app'
import {connectAuthEmulator, getAuth} from 'firebase/auth'
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore'
import {assertSafeTestEnvironment} from '../app/assertSafeTestEnvironment'

const environment = import.meta.env
export const {VITE_DEV_FIRESTORE: devFirestore} = environment
const testMode = environment.MODE === 'test'

if (testMode) assertSafeTestEnvironment(environment)

const projectId = environment.VITE_FIREBASE_PROJECT_ID || 'lpu-belt-explorer'

// Firebase configuration
const firebaseConfig = {
    apiKey: environment.VITE_FIREBASE_API_KEY,
    authDomain: environment.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: environment.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    messagingSenderId: environment.VITE_FIREBASE_MESSAGING_SENDER_ID || '1004257270920',
    appId: environment.VITE_FIREBASE_APP_ID || '1:1004257270920:web:ba605e14f98e926a1e533d'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = devFirestore==='true' ? getFirestore(app, 'lpubelts-dev') : getFirestore(app)

if (environment.VITE_USE_FIREBASE_EMULATORS === 'true') {
    const authHost = environment.VITE_AUTH_EMULATOR_HOST
    const authPort = environment.VITE_AUTH_EMULATOR_PORT
    const firestoreHost = environment.VITE_FIRESTORE_EMULATOR_HOST
    const firestorePort = Number(environment.VITE_FIRESTORE_EMULATOR_PORT)

    connectAuthEmulator(auth, `http://${authHost}:${authPort}`, {disableWarnings: true})
    connectFirestoreEmulator(db, firestoreHost, firestorePort)
}
