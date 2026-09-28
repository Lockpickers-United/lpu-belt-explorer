import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

function canonicalPath(filePath) {
    try {
        return fs.realpathSync(filePath)
    } catch {
        return path.normalize(filePath)
    }
}

export default function isDirectRun(moduleUrl, argv = process.argv) {
    if (!argv[1]) return false
    return canonicalPath(fileURLToPath(moduleUrl)) === canonicalPath(path.resolve(argv[1]))
}
