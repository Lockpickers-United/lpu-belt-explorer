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

describe('RAFL preview imports', () => {
    it('does not require configuration, contact Google, create directories, or write files', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-rafl-preview-import-'))
        tempDirs.push(root)
        const outputDir = path.join(root, 'must-not-be-created')
        const env = {
            ...process.env,
            RAFL_PREVIEW_ENABLED: 'true',
            RAFL_PREVIEW_OUTPUT_DIR: outputDir
        }
        delete env.RAFL_SHEET_ID
        delete env.LPU_JOB_ENV
        delete env.ALLOW_PRODUCTION_JOB
        env.USER = 'import-safety-unknown-user'
        env.LOGNAME = 'import-safety-unknown-user'

        const urls = [
            new URL('./importRaflData.js', import.meta.url).href,
            new URL('./importRaflDataConfig.js', import.meta.url).href,
            new URL('./importRaflDataRuntime.js', import.meta.url).href,
            new URL('./requireRaflAdmin.js', import.meta.url).href
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
