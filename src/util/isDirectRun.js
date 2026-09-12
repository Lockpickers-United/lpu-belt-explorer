import path from 'node:path'
import {pathToFileURL} from 'node:url'

export default function isDirectRun(moduleUrl, argv = process.argv) {
    if (!argv[1]) return false
    return moduleUrl === pathToFileURL(path.resolve(argv[1])).href
}
