import {fileURLToPath} from 'node:url'
import {loadRuntimeEnvironment} from '../../util/runtimeEnvironment.js'

const collectionsDir = fileURLToPath(new URL('.', import.meta.url))

export function loadCollectionEnvironment(options = {}) {
    return loadRuntimeEnvironment({...options, envDir: collectionsDir})
}
