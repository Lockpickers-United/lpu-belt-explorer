import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {describe, expect, it} from 'vitest'

const execFileAsync = promisify(execFile)

describe('Firebase-activity imports', () => {
    it('does not require runtime configuration or process activity', async () => {
        const env = {
            ...process.env,
            FIREBASE_ACTIVITY_LOGGING_ENABLED: 'true',
            USER: 'import-safety-unknown-user',
            LOGNAME: 'import-safety-unknown-user'
        }
        delete env.LPU_JOB_ENV
        delete env.ALLOW_PRODUCTION_JOB

        const urls = [
            new URL('./logFirebaseActivity.js', import.meta.url).href,
            new URL('./firebaseActivityConfig.js', import.meta.url).href,
            new URL('./firebaseActivityRuntime.js', import.meta.url).href
        ]
        const script = `await Promise.all(${JSON.stringify(urls)}.map(url => import(url)))`
        const result = await execFileAsync(
            process.execPath,
            ['--input-type=module', '--eval', script],
            {env}
        )

        expect(result.stdout).toBe('')
        expect(result.stderr).toBe('')
    })
})
