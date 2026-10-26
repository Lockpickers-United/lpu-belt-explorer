import {fileURLToPath} from 'node:url'
import {describe, expect, it, vi} from 'vitest'
import {allEvidenceExportMain} from './awardsEvidenceProcess.js'
import {awardsEvidenceExportMain} from './awardsEvidenceExport.js'
import {collectionsExportMain} from './collectionsExport.js'
import {collectionAnalyzerMain} from './collectionAnalyzer.js'
import {collectionStatsProcessMain} from './collectionStatsProcess.js'
import {exportAllProcessorMain} from './exportAllProcessor.js'
import {leaderboardStatsProcessMain} from './leaderboardStatsProcess.js'
import {raflCollectionUtilsMain} from './raflCollectionUtils.js'
import {discordBeltCountsDownloadMain} from './discordBeltCountsDownload.js'
import {lockStatsMain} from '../_deprecated/lockStatistics/lockStats.js'

const developmentEnvironmentPath = fileURLToPath(
    new URL('../../../.env.development', import.meta.url)
)

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
        ['collection analyzer', collectionAnalyzerMain],
        ['collection stats processor', collectionStatsProcessMain],
        ['export-all processor', exportAllProcessorMain],
        ['leaderboard stats processor', leaderboardStatsProcessMain],
        ['RAFL collection processor', raflCollectionUtilsMain],
        ['Discord belt counts downloader', discordBeltCountsDownloadMain],
        ['lock statistics processor', lockStatsMain]
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
            path: developmentEnvironmentPath,
            override: false,
            quiet: true
        }))
    })

    it('requires the API output directory for the all-evidence processor', async () => {
        const {COLLECTION_API_DIR: _apiDir, ...envWithoutApiDir} = env

        await expect(allEvidenceExportMain({
            env: envWithoutApiDir,
            argv: ['node', 'awardsEvidenceProcess.js', '--check-config'],
            loadEnvironment: vi.fn().mockReturnValue({parsed: {}})
        })).rejects.toThrow(/COLLECTION_API_DIR/)
    })
})
