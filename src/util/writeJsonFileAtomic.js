import {randomUUID} from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function writeJsonFileAtomic(filePath, data, {
    fileSystem = fs,
    spaces,
    trailingNewline = false
} = {}) {
    const json = JSON.stringify(data, null, spaces)
    if (json === undefined) {
        throw new TypeError('JSON data must serialize to a string')
    }

    const directory = path.dirname(filePath)
    const tempFile = path.join(
        directory,
        `.${path.basename(filePath)}.tmp-${process.pid}-${randomUUID()}`
    )
    await fileSystem.mkdir(directory, {recursive: true})

    try {
        await fileSystem.writeFile(
            tempFile,
            trailingNewline ? `${json}\n` : json,
            'utf8'
        )
        await fileSystem.rename(tempFile, filePath)
    } catch (error) {
        try {
            await fileSystem.rm(tempFile, {force: true})
        } catch {
            // Preserve the original write or rename failure.
        }
        throw error
    }
}
