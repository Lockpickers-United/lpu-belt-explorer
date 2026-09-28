import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {afterEach, describe, expect, it} from 'vitest'
import isDirectRun from './isDirectRun.js'

const directories = []

afterEach(async () => {
    await Promise.all(directories.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

describe('isDirectRun', () => {
    it('recognizes an entry point invoked through a symlinked release path', async () => {
        const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'direct-run-'))
        directories.push(directory)
        const releaseDir = path.join(directory, 'releases', 'release-1')
        const scriptPath = path.join(releaseDir, 'scripts', 'job.js')
        const currentPath = path.join(directory, 'current')
        await fs.mkdir(path.dirname(scriptPath), {recursive: true})
        await fs.writeFile(scriptPath, '')
        await fs.symlink(releaseDir, currentPath)

        expect(isDirectRun(pathToFileURL(scriptPath).href, [
            'node',
            path.join(currentPath, 'scripts', 'job.js')
        ])).toBe(true)
    })

    it('rejects a different entry point', async () => {
        const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'direct-run-'))
        directories.push(directory)
        const modulePath = path.join(directory, 'module.js')
        const entryPath = path.join(directory, 'entry.js')
        await Promise.all([
            fs.writeFile(modulePath, ''),
            fs.writeFile(entryPath, '')
        ])

        expect(isDirectRun(pathToFileURL(modulePath).href, ['node', entryPath])).toBe(false)
    })
})
