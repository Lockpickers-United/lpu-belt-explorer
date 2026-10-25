import {initializeApp} from 'firebase/app'
import {connectAuthEmulator, getAuth} from 'firebase/auth'
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore'
import {assertSafeTestEnvironment} from '../app/assertSafeTestEnvironment'
import {
    createFirebaseConfig,
    getFirebaseEmulatorConfig,
    getFirestoreDatabaseId
} from './firebaseConfig'

const environment = import.meta.env
export const {VITE_DEV_FIRESTORE: devFirestore} = environment
const testMode = environment.MODE === 'test'

if (testMode) assertSafeTestEnvironment(environment)

const firebaseConfig = createFirebaseConfig(environment)

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
const databaseId = getFirestoreDatabaseId(environment)
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app)

const emulatorConfig = getFirebaseEmulatorConfig(environment)

if (emulatorConfig) {
    connectAuthEmulator(auth, emulatorConfig.authUrl, {disableWarnings: true})
    connectFirestoreEmulator(db, emulatorConfig.firestoreHost, emulatorConfig.firestorePort)
}
