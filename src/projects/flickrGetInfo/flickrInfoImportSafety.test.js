import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {describe, expect, it} from 'vitest'

const execFileAsync = promisify(execFile)

describe('Flickr-info imports', () => {
    it('does not require credentials, create a client, or contact Flickr', async () => {
        const env = {
            ...process.env,
            FLICKR_INFO_ENABLED: 'true',
            USER: 'import-safety-unknown-user',
            LOGNAME: 'import-safety-unknown-user'
        }
        delete env.LPU_JOB_ENV
        delete env.ALLOW_PRODUCTION_JOB
        delete env.FLICKR_API_KEY

        const urls = [
            new URL('./getFlickrInfo.js', import.meta.url).href,
            new URL('./flickrInfoConfig.js', import.meta.url).href,
            new URL('./flickrInfoRuntime.js', import.meta.url).href
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
