import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => ({
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(),
    cert: vi.fn(serviceAccount => ({serviceAccount})),
    getApps: vi.fn(() => []),
    initializeApp: vi.fn((_options, name) => ({name})),
    getAuth: vi.fn(app => ({app})),
    getFirestore: vi.fn(() => ({settings: vi.fn()}))
}))

vi.mock('node:fs', () => ({
    default: {
        existsSync: mocks.existsSync,
        readFileSync: mocks.readFileSync
    }
}))

vi.mock('firebase-admin/app', () => ({
    cert: mocks.cert,
    getApps: mocks.getApps,
    initializeApp: mocks.initializeApp
}))

vi.mock('firebase-admin/auth', () => ({
    getAuth: mocks.getAuth
}))

vi.mock('firebase-admin/firestore', () => ({
    getFirestore: mocks.getFirestore
}))

import {getFirebaseAdminServices, getFirestoreDb} from './firebaseAdmin.js'

const importSideEffects = {
    credentialReads: mocks.readFileSync.mock.calls.length,
    appInitializations: mocks.initializeApp.mock.calls.length
}

function config(overrides = {}) {
    return {
        firebaseProjectId: 'lpu-belt-explorer',
        firestoreDatabaseId: 'lpubelts-dev',
        serviceAccountPath: '/tmp/request-lock-service-account.json',
        ...overrides
    }
}

describe('getFirebaseAdminServices', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getApps.mockReturnValue([])
        mocks.readFileSync.mockReturnValue(JSON.stringify({project_id: 'lpu-belt-explorer'}))
    })

    it('has no credential or Firebase side effects during import', () => {
        expect(importSideEffects).toEqual({credentialReads: 0, appInitializations: 0})
    })

    it('creates a named app and explicitly selects the configured database', () => {
        const target = config()
        const services = getFirebaseAdminServices(target)

        expect(mocks.readFileSync).toHaveBeenCalledWith(target.serviceAccountPath, 'utf8')
        expect(mocks.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({projectId: 'lpu-belt-explorer'}),
            expect.stringMatching(/^lpu-server-lpu-belt-explorer-lpubelts-dev-[a-f0-9]{12}$/)
        )
        expect(mocks.getFirestore).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.stringMatching(/^lpu-server-lpu-belt-explorer-lpubelts-dev-[a-f0-9]{12}$/)
            }),
            'lpubelts-dev'
        )
        expect(services.db.settings).toHaveBeenCalledWith({ignoreUndefinedProperties: true})
        expect(mocks.getAuth).toHaveBeenCalledWith(services.app)
    })

    it('selects the default database only when explicitly configured', () => {
        const target = config({
            firestoreDatabaseId: '(default)',
            serviceAccountPath: '/tmp/request-lock-production-account.json'
        })

        getFirebaseAdminServices(target)

        expect(mocks.getFirestore).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.stringMatching(/^lpu-server-lpu-belt-explorer--default--[a-f0-9]{12}$/)
            })
        )
    })

    it('rejects credentials belonging to another Firebase project', () => {
        const target = config({serviceAccountPath: '/tmp/request-lock-wrong-project.json'})
        mocks.readFileSync.mockReturnValue(JSON.stringify({project_id: 'another-project'}))

        expect(() => getFirebaseAdminServices(target)).toThrowError(
            expect.objectContaining({code: 'firebase_project_mismatch'})
        )
        expect(mocks.initializeApp).not.toHaveBeenCalled()
    })
})

describe('default Firebase runtime services', () => {
    const variableNames = [
        'LPU_JOB_ENV',
        'FIREBASE_PROJECT_ID',
        'FIRESTORE_DATABASE_ID',
        'FIREBASE_SERVICE_ACCOUNT_PATH',
        'ALLOW_PRODUCTION_JOB'
    ]
    const originalValues = Object.fromEntries(variableNames.map(name => [name, process.env[name]]))

    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getApps.mockReturnValue([])
        mocks.readFileSync.mockReturnValue(JSON.stringify({project_id: 'lpu-belt-explorer'}))
        Object.assign(process.env, {
            LPU_JOB_ENV: 'development',
            FIREBASE_PROJECT_ID: 'lpu-belt-explorer',
            FIRESTORE_DATABASE_ID: '(default)',
            FIREBASE_SERVICE_ACCOUNT_PATH: '/tmp/default-runtime-service-account.json'
        })
        delete process.env.ALLOW_PRODUCTION_JOB
    })

    afterEach(() => {
        variableNames.forEach(name => {
            if (originalValues[name] === undefined) delete process.env[name]
            else process.env[name] = originalValues[name]
        })
    })

    it('fails closed before opening the default database without production opt-in', async () => {
        await expect(getFirestoreDb()).rejects.toMatchObject({
            code: 'firebase_runtime_production_not_allowed'
        })
        expect(mocks.getFirestore).not.toHaveBeenCalled()
    })

    it('uses the explicitly configured named database', async () => {
        process.env.FIRESTORE_DATABASE_ID = 'server-test-database'

        await getFirestoreDb()

        expect(mocks.getFirestore).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.stringMatching(/^lpu-server-lpu-belt-explorer-server-test-database-/)
            }),
            'server-test-database'
        )
    })
})
