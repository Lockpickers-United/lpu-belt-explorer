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

describe('upload-content imports', () => {
    it('does not require configuration or create upload directories', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-content-upload-import-'))
        tempDirs.push(root)
        const uploadDir = path.join(root, 'must-not-be-created')
        const env = {...process.env, CONTENT_UPLOAD_DIR: uploadDir}
        delete env.LPU_JOB_ENV
        delete env.ALLOW_PRODUCTION_JOB
        env.USER = 'import-safety-unknown-user'
        env.LOGNAME = 'import-safety-unknown-user'

        const urls = [
            new URL('./uploadContent.js', import.meta.url).href,
            new URL('./uploadContentRuntime.js', import.meta.url).href
        ]
        const script = `await Promise.all(${JSON.stringify(urls)}.map(url => import(url)))`
        const result = await execFileAsync(
            process.execPath,
            ['--input-type=module', '--eval', script],
            {env}
        )

        expect(result.stdout).toBe('')
        expect(result.stderr).toBe('')
        await expect(fs.access(uploadDir)).rejects.toMatchObject({code: 'ENOENT'})
    })
})
