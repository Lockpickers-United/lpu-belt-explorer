import {describe, expect, it} from 'vitest'
import {assertSafeTestEnvironment} from '../../src/app/assertSafeTestEnvironment'

const safeEnvironment = {
    MODE: 'test',
    VITE_FIREBASE_API_KEY: 'test-only-api-key',
    VITE_FIREBASE_PROJECT_ID: 'demo-lpubelts-test',
    VITE_USE_FIREBASE_EMULATORS: 'true',
    VITE_AUTH_EMULATOR_HOST: '127.0.0.1',
    VITE_AUTH_EMULATOR_PORT: '9099',
    VITE_FIRESTORE_EMULATOR_HOST: '127.0.0.1',
    VITE_FIRESTORE_EMULATOR_PORT: '8080',
    VITE_DATA_BASE_URL: '/data',
    VITE_LOCKBAZAAR_DATA_URL: '/test-data/lockbazaar-entry-ids.json',
    VITE_NODE_SERVER_URL: '/test-api',
    VITE_API_SERVER_URL: '/test-api'
}

describe('assertSafeTestEnvironment', () => {
    it('accepts synthetic Firebase and relative service configuration', () => {
        expect(() => assertSafeTestEnvironment(safeEnvironment)).not.toThrow()
    })

    it('rejects a deployable Firebase project', () => {
        expect(() => assertSafeTestEnvironment({
            ...safeEnvironment,
            VITE_FIREBASE_PROJECT_ID: 'lpu-belt-explorer'
        })).toThrow('non-deployable demo Firebase project')
    })

    it('rejects non-loopback Firebase emulators', () => {
        expect(() => assertSafeTestEnvironment({
            ...safeEnvironment,
            VITE_FIRESTORE_EMULATOR_HOST: 'firestore.googleapis.com'
        })).toThrow('loopback hosts')
    })

    it('rejects live service URLs', () => {
        expect(() => assertSafeTestEnvironment({
            ...safeEnvironment,
            VITE_API_SERVER_URL: 'https://explore.lpubelts.com/services'
        })).toThrow('relative or use a loopback host')
    })
})
