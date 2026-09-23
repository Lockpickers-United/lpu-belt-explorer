import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {describe, expect, it} from 'vitest'
import fs from 'node:fs/promises'

const execFileAsync = promisify(execFile)
const testDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(testDir, '../../..')
const exporterUrls = [
    new URL('./collectionsExport.js', import.meta.url).href,
    new URL('./awardsEvidenceExport.js', import.meta.url).href,
    new URL('./allEvidenceExport.js', import.meta.url).href,
    new URL('./collectionAnalyzer.js', import.meta.url).href,
    new URL('./collectionStatsProcess.js', import.meta.url).href,
    new URL('./exportAllProcessor.js', import.meta.url).href,
    new URL('./leaderboardStatsProcess.js', import.meta.url).href,
    new URL('./raflCollectionUtils.js', import.meta.url).href
]

describe('active exporter imports', () => {
    it('does not use OS usernames for environment selection', async () => {
        const sources = await Promise.all([
            fs.readFile(new URL('./collectionsExport.js', import.meta.url), 'utf8'),
            fs.readFile(new URL('./awardsEvidenceExport.js', import.meta.url), 'utf8'),
            fs.readFile(new URL('./allEvidenceExport.js', import.meta.url), 'utf8'),
            fs.readFile(new URL('./collectionAnalyzer.js', import.meta.url), 'utf8'),
            fs.readFile(new URL('./collectionStatsProcess.js', import.meta.url), 'utf8'),
            fs.readFile(new URL('./exportAllProcessor.js', import.meta.url), 'utf8'),
            fs.readFile(new URL('./leaderboardStatsProcess.js', import.meta.url), 'utf8'),
            fs.readFile(new URL('./raflCollectionUtils.js', import.meta.url), 'utf8')
        ])

        sources.forEach(source => {
            expect(source).not.toMatch(/process\.env\.(USER|LOGNAME)/)
        })
    })

    it('imports without runtime configuration, credentials, or job execution', async () => {
        const env = {...process.env}
        Object.keys(env)
            .filter(key => key.startsWith('LPU_')
                || key.startsWith('FIREBASE_')
                || key.startsWith('FIRESTORE_')
                || key.startsWith('COLLECTION_'))
            .forEach(key => delete env[key])
        env.USER = 'import-safety-unknown-user'
        env.LOGNAME = 'import-safety-unknown-user'

        const script = `await Promise.all(${JSON.stringify(exporterUrls)}.map(url => import(url)))`
        const result = await execFileAsync(
            process.execPath,
            ['--input-type=module', '--eval', script],
            {cwd: repoRoot, env}
        )

        expect(result.stdout).toBe('')
        expect(result.stderr).toBe('')
    })
})
