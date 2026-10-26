import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {describe, expect, it} from 'vitest'

const execFileAsync = promisify(execFile)

describe('email-form imports', () => {
    it('does not require runtime configuration or load email dependencies', async () => {
        const env = {...process.env}
        delete env.EMAIL_FORM_ENABLED
        delete env.LPU_JOB_ENV
        delete env.ALLOW_PRODUCTION_JOB
        env.USER = 'import-safety-unknown-user'
        env.LOGNAME = 'import-safety-unknown-user'

        const urls = [
            new URL('./emailFormContents.js', import.meta.url).href,
            new URL('./emailFormContentsConfig.js', import.meta.url).href,
            new URL('./emailFormContentsRuntime.js', import.meta.url).href
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
