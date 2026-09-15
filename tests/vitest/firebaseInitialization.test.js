import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const firebaseHarness = vi.hoisted(() => ({
    app: {name: 'test-app'},
    auth: {name: 'test-auth'},
    db: {name: 'test-db'},
    initializeApp: vi.fn(),
    getAuth: vi.fn(),
    getFirestore: vi.fn(),
    connectAuthEmulator: vi.fn(),
    connectFirestoreEmulator: vi.fn()
}))

vi.mock('firebase/app', () => ({initializeApp: firebaseHarness.initializeApp}))
vi.mock('firebase/auth', () => ({
    connectAuthEmulator: firebaseHarness.connectAuthEmulator,
    getAuth: firebaseHarness.getAuth
}))
vi.mock('firebase/firestore', () => ({
    connectFirestoreEmulator: firebaseHarness.connectFirestoreEmulator,
    getFirestore: firebaseHarness.getFirestore
}))

const baseEnvironment = {
    VITE_FIREBASE_API_KEY: 'test-only-api-key',
    VITE_FIREBASE_PROJECT_ID: 'demo-lpubelts',
    VITE_FIREBASE_AUTH_DOMAIN: 'demo-lpubelts.firebaseapp.com',
    VITE_FIREBASE_STORAGE_BUCKET: 'demo-lpubelts.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
    VITE_FIREBASE_APP_ID: 'test-app-id',
    VITE_AUTH_EMULATOR_HOST: '127.0.0.1',
    VITE_AUTH_EMULATOR_PORT: '9099',
    VITE_FIRESTORE_EMULATOR_HOST: '127.0.0.1',
    VITE_FIRESTORE_EMULATOR_PORT: '8080',
    VITE_DATA_BASE_URL: '/test-data',
    VITE_LOCKBAZAAR_DATA_URL: '/test-data/lock-bazaar.json',
    VITE_NODE_SERVER_URL: '/test-api',
    VITE_API_SERVER_URL: '/test-api'
}

const stubEnvironment = values => {
    Object.entries({...baseEnvironment, ...values}).forEach(([name, value]) => {
        vi.stubEnv(name, value)
    })
}

describe('Firebase initialization', () => {
    beforeEach(() => {
        vi.resetModules()
        Object.values(firebaseHarness).forEach(value => {
            if (typeof value === 'function') value.mockReset()
        })
        firebaseHarness.initializeApp.mockReturnValue(firebaseHarness.app)
        firebaseHarness.getAuth.mockReturnValue(firebaseHarness.auth)
        firebaseHarness.getFirestore.mockReturnValue(firebaseHarness.db)
    })

    afterEach(() => vi.unstubAllEnvs())

    it('initializes the default database without emulator connections', async () => {
        stubEnvironment({
            MODE: 'development',
            VITE_DEV_FIRESTORE: 'false',
            VITE_USE_FIREBASE_EMULATORS: 'false'
        })

        const firebase = await import('../../src/auth/firebase.js')

        expect(firebaseHarness.initializeApp).toHaveBeenCalledWith(expect.objectContaining({
            apiKey: 'test-only-api-key',
            projectId: 'demo-lpubelts'
        }))
        expect(firebaseHarness.getAuth).toHaveBeenCalledWith(firebaseHarness.app)
        expect(firebaseHarness.getFirestore).toHaveBeenCalledWith(firebaseHarness.app)
        expect(firebaseHarness.connectAuthEmulator).not.toHaveBeenCalled()
        expect(firebaseHarness.connectFirestoreEmulator).not.toHaveBeenCalled()
        expect(firebase).toMatchObject({
            app: firebaseHarness.app,
            auth: firebaseHarness.auth,
            db: firebaseHarness.db
        })
    })

    it('selects the development database and connects both loopback emulators', async () => {
        stubEnvironment({
            MODE: 'test',
            VITE_DEV_FIRESTORE: 'true',
            VITE_USE_FIREBASE_EMULATORS: 'true'
        })

        await import('../../src/auth/firebase.js')

        expect(firebaseHarness.getFirestore).toHaveBeenCalledWith(
            firebaseHarness.app,
            'lpubelts-dev'
        )
        expect(firebaseHarness.connectAuthEmulator).toHaveBeenCalledWith(
            firebaseHarness.auth,
            'http://127.0.0.1:9099',
            {disableWarnings: true}
        )
        expect(firebaseHarness.connectFirestoreEmulator).toHaveBeenCalledWith(
            firebaseHarness.db,
            '127.0.0.1',
            8080
        )
    })
})
