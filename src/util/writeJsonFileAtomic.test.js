import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {writeJsonFileAtomic} from './writeJsonFileAtomic.js'

const tempDirs = []

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

describe('writeJsonFileAtomic', () => {
    it('creates the destination directory and replaces the file without leaving a temporary file', async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-atomic-json-'))
        tempDirs.push(root)
        const directory = path.join(root, 'nested')
        const filePath = path.join(directory, 'output.json')

        await writeJsonFileAtomic(filePath, {value: 1}, {
            spaces: 2,
            trailingNewline: true
        })

        expect(await fs.readFile(filePath, 'utf8')).toBe('{\n  "value": 1\n}\n')
        expect(await fs.readdir(directory)).toEqual(['output.json'])
    })

    it('removes the temporary file and preserves the original error when rename fails', async () => {
        const failure = new Error('rename failed')
        const fileSystem = {
            mkdir: vi.fn().mockResolvedValue(undefined),
            writeFile: vi.fn().mockResolvedValue(undefined),
            rename: vi.fn().mockRejectedValue(failure),
            rm: vi.fn().mockRejectedValue(new Error('cleanup failed'))
        }

        await expect(writeJsonFileAtomic('/output/data.json', {value: 1}, {fileSystem}))
            .rejects.toBe(failure)

        const tempFile = fileSystem.writeFile.mock.calls[0][0]
        expect(tempFile).toMatch(/^\/output\/\.data\.json\.tmp-/)
        expect(fileSystem.rename).toHaveBeenCalledWith(tempFile, '/output/data.json')
        expect(fileSystem.rm).toHaveBeenCalledWith(tempFile, {force: true})
    })

    it('rejects non-serializable top-level data before creating a directory', async () => {
        const fileSystem = {
            mkdir: vi.fn()
        }

        await expect(writeJsonFileAtomic('/output/data.json', undefined, {fileSystem}))
            .rejects.toThrow('JSON data must serialize to a string')
        expect(fileSystem.mkdir).not.toHaveBeenCalled()
    })
})
