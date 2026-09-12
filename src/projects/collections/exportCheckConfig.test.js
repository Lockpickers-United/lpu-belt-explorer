import {describe, expect, it, vi} from 'vitest'
import {awardsEvidenceExportMain} from './awardsEvidenceExport.js'
import {collectionsExportMain} from './collectionsExport.js'

const env = {
    LPU_JOB_ENV: 'development',
    FIREBASE_PROJECT_ID: 'lpu-belt-explorer',
    FIRESTORE_DATABASE_ID: 'lpubelts-dev',
    FIREBASE_SERVICE_ACCOUNT_PATH: '/missing/service-account.json',
    COLLECTION_EXPORT_DIR: '/tmp/lpu/exports',
    COLLECTION_BACKUP_DIR: '/tmp/lpu/backups',
    COLLECTION_PUBLIC_DATA_DIR: '/tmp/lpu/public-data'
}

describe('exporter --check-config mode', () => {
    it.each([
        ['collections', collectionsExportMain],
        ['awards/evidence', awardsEvidenceExportMain]
    ])('validates and reports %s configuration without loading credentials', async (_name, main) => {
        const writeOutput = vi.fn()

        const summary = await main({
            env,
            argv: ['node', 'exporter.js', '--check-config'],
            writeOutput
        })

        expect(summary).toMatchObject({
            jobEnvironment: 'development',
            firestoreDatabaseId: 'lpubelts-dev',
            serviceAccountPath: '/missing/service-account.json',
            productionAccessEnabled: false
        })
        expect(writeOutput).toHaveBeenCalledOnce()
    })
})
