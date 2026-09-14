import {describe, expect, it} from 'vitest'
import {
    createFirebaseConfig,
    getFirebaseEmulatorConfig,
    getFirestoreDatabaseId
} from '../../src/auth/firebaseConfig'

describe('firebaseConfig', () => {
    it('creates the normal default Firebase configuration', () => {
        expect(createFirebaseConfig({VITE_FIREBASE_API_KEY: 'test-key'})).toEqual({
            apiKey: 'test-key',
            authDomain: 'lpu-belt-explorer.firebaseapp.com',
            projectId: 'lpu-belt-explorer',
            storageBucket: 'lpu-belt-explorer.appspot.com',
            messagingSenderId: '1004257270920',
            appId: '1:1004257270920:web:ba605e14f98e926a1e533d'
        })
    })

    it('uses explicit project configuration and selects the development database', () => {
        const environment = {
            VITE_FIREBASE_API_KEY: 'custom-key',
            VITE_FIREBASE_PROJECT_ID: 'demo-project',
            VITE_FIREBASE_AUTH_DOMAIN: 'auth.example.test',
            VITE_FIREBASE_STORAGE_BUCKET: 'bucket.example.test',
            VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
            VITE_FIREBASE_APP_ID: 'app-id',
            VITE_DEV_FIRESTORE: 'true'
        }

        expect(createFirebaseConfig(environment)).toEqual({
            apiKey: 'custom-key',
            authDomain: 'auth.example.test',
            projectId: 'demo-project',
            storageBucket: 'bucket.example.test',
            messagingSenderId: '123',
            appId: 'app-id'
        })
        expect(getFirestoreDatabaseId(environment)).toBe('lpubelts-dev')
        expect(getFirestoreDatabaseId({VITE_DEV_FIRESTORE: 'false'})).toBeUndefined()
    })

    it('returns loopback emulator connection details only when enabled', () => {
        expect(getFirebaseEmulatorConfig({VITE_USE_FIREBASE_EMULATORS: 'false'})).toBeNull()
        expect(getFirebaseEmulatorConfig({
            VITE_USE_FIREBASE_EMULATORS: 'true',
            VITE_AUTH_EMULATOR_HOST: '127.0.0.1',
            VITE_AUTH_EMULATOR_PORT: '9099',
            VITE_FIRESTORE_EMULATOR_HOST: 'localhost',
            VITE_FIRESTORE_EMULATOR_PORT: '8080'
        })).toEqual({
            authUrl: 'http://127.0.0.1:9099',
            firestoreHost: 'localhost',
            firestorePort: 8080
        })
    })
})
