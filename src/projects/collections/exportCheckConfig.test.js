import {describe, expect, it, vi} from 'vitest'
import {allEvidenceExportMain} from './allEvidenceExport.js'
import {awardsEvidenceExportMain} from './awardsEvidenceExport.js'
import {collectionsExportMain} from './collectionsExport.js'
import {collectionAnalyzerMain} from './collectionAnalyzer.js'

const env = {
    NODE_ENV: 'development',
    LPU_JOB_ENV: 'development',
    FIREBASE_PROJECT_ID: 'lpu-belt-explorer',
    FIRESTORE_DATABASE_ID: 'lpubelts-dev',
    FIREBASE_SERVICE_ACCOUNT_PATH: '/missing/service-account.json',
    COLLECTION_EXPORT_DIR: '/tmp/lpu/exports',
    COLLECTION_BACKUP_DIR: '/tmp/lpu/backups',
    COLLECTION_PUBLIC_DATA_DIR: '/tmp/lpu/public-data',
    COLLECTION_DAILY_DIR: '/tmp/lpu/daily',
    COLLECTION_API_DIR: '/tmp/lpu/api-data'
}

describe('exporter --check-config mode', () => {
    it.each([
        ['collections', collectionsExportMain],
        ['awards/evidence', awardsEvidenceExportMain],
        ['all evidence', allEvidenceExportMain],
        ['collection analyzer', collectionAnalyzerMain]
    ])('validates and reports %s configuration without loading credentials', async (_name, main) => {
        const writeOutput = vi.fn()
        const loadEnvironment = vi.fn().mockReturnValue({parsed: {}})

        const summary = await main({
            env: {...env},
            argv: ['node', 'exporter.js', '--check-config'],
            writeOutput,
            loadEnvironment
        })

        expect(summary).toMatchObject({
            jobEnvironment: 'development',
            firestoreDatabaseId: 'lpubelts-dev',
            serviceAccountPath: '/missing/service-account.json',
            dailyDir: '/tmp/lpu/daily',
            apiDir: '/tmp/lpu/api-data',
            productionAccessEnabled: false
        })
        expect(writeOutput).toHaveBeenCalledOnce()
        expect(loadEnvironment).toHaveBeenCalledWith(expect.objectContaining({
            path: expect.stringMatching(/src\/projects\/collections\/\.env\.development$/),
            override: false,
            quiet: true
        }))
    })
})
