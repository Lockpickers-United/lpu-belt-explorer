import {execFile} from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'
import {afterEach, describe, expect, it} from 'vitest'

const execFileAsync = promisify(execFile)
const tempDirs = []

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(dir => fs.rm(dir, {recursive: true, force: true})))
})

describe('Reddit belt imports', () => {
    it('does not require credentials, run Python, create directories, or write files', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-reddit-belts-import-'))
        tempDirs.push(root)
        const outputDir = path.join(root, 'must-not-be-created')
        const env = {
            ...process.env,
            REDDIT_BELTS_ENABLED: 'true',
            REDDIT_BELTS_OUTPUT_DIR: outputDir
        }
        delete env.LPU_JOB_ENV
        delete env.ALLOW_PRODUCTION_JOB
        delete env.REDDIT_CREDENTIALS_PATH
        delete env.REDDIT_BELTS_SCRIPT_PATH
        env.USER = 'import-safety-unknown-user'
        env.LOGNAME = 'import-safety-unknown-user'

        const urls = [
            new URL('./getRedditBelts.js', import.meta.url).href,
            new URL('./redditBeltsConfig.js', import.meta.url).href,
            new URL('./redditBeltsRuntime.js', import.meta.url).href,
            new URL('./requireLpuAdmin.js', import.meta.url).href,
            new URL('./runGetRedditBelts.js', import.meta.url).href
        ]
        const script = `await Promise.all(${JSON.stringify(urls)}.map(url => import(url)))`
        const result = await execFileAsync(
            process.execPath,
            ['--input-type=module', '--eval', script],
            {env}
        )

        expect(result.stdout).toBe('')
        expect(result.stderr).toBe('')
        await expect(fs.access(outputDir)).rejects.toMatchObject({code: 'ENOENT'})
    })
})
