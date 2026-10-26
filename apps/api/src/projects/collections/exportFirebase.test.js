import {beforeEach, describe, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => ({
    readFile: vi.fn(),
    cert: vi.fn(serviceAccount => ({serviceAccount})),
    getApps: vi.fn(() => []),
    initializeApp: vi.fn((_options, name) => ({name})),
    getFirestore: vi.fn(() => ({settings: vi.fn()}))
}))

vi.mock('node:fs/promises', () => ({
    default: {readFile: mocks.readFile}
}))

vi.mock('firebase-admin/app', () => ({
    cert: mocks.cert,
    getApps: mocks.getApps,
    initializeApp: mocks.initializeApp
}))

vi.mock('firebase-admin/firestore', () => ({
    getFirestore: mocks.getFirestore
}))

import {getExportFirestore} from './exportFirebase.js'

const importSideEffects = {
    credentialReads: mocks.readFile.mock.calls.length,
    appInitializations: mocks.initializeApp.mock.calls.length
}

function config(overrides = {}) {
    return {
        firebaseProjectId: 'lpu-belt-explorer',
        firestoreDatabaseId: 'lpubelts-dev',
        serviceAccountPath: '/tmp/service-account.json',
        ...overrides
    }
}

describe('getExportFirestore', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getApps.mockReturnValue([])
        mocks.readFile.mockResolvedValue(JSON.stringify({project_id: 'lpu-belt-explorer'}))
    })

    it('does not load credentials merely by importing the factory', () => {
        expect(importSideEffects).toEqual({
            credentialReads: 0,
            appInitializations: 0
        })
    })

    it('creates a named app and explicitly selects a named database', async () => {
        const jobConfig = config({serviceAccountPath: '/tmp/named-database-account.json'})

        const db = await getExportFirestore(jobConfig)

        expect(mocks.readFile).toHaveBeenCalledWith(jobConfig.serviceAccountPath, 'utf8')
        expect(mocks.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({projectId: 'lpu-belt-explorer'}),
            expect.stringMatching(/^lpu-export-lpu-belt-explorer-lpubelts-dev-[a-f0-9]{12}$/)
        )
        expect(mocks.getFirestore).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.stringMatching(/^lpu-export-lpu-belt-explorer-lpubelts-dev-[a-f0-9]{12}$/)
            }),
            'lpubelts-dev'
        )
        expect(db.settings).toHaveBeenCalledWith({ignoreUndefinedProperties: true})
    })

    it('selects the default database only when explicitly configured', async () => {
        const jobConfig = config({
            firestoreDatabaseId: '(default)',
            serviceAccountPath: '/tmp/default-database-account.json'
        })

        await getExportFirestore(jobConfig)

        expect(mocks.getFirestore).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.stringMatching(/^lpu-export-lpu-belt-explorer--default--[a-f0-9]{12}$/)
            })
        )
    })

    it('rejects a service account for a different Firebase project', async () => {
        const jobConfig = config({serviceAccountPath: '/tmp/wrong-project-account.json'})
        mocks.readFile.mockResolvedValue(JSON.stringify({project_id: 'another-project'}))

        await expect(getExportFirestore(jobConfig)).rejects.toMatchObject({
            code: 'export_job_project_mismatch'
        })
        expect(mocks.initializeApp).not.toHaveBeenCalled()
    })
})
