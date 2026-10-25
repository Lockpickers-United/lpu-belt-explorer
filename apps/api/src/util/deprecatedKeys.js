import path from 'node:path'
import {pathToFileURL} from 'node:url'

function configurationError(code, message, cause) {
    const error = new Error(message, cause ? {cause} : undefined)
    error.code = code
    return error
}

export function getDeprecatedKeysDir({
    env = process.env,
    cwd = process.cwd()
} = {}) {
    const configuredDir = env.DEPRECATED_KEYS_DIR?.trim()
    if (!configuredDir) {
        throw configurationError(
            'deprecated_keys_dir_missing',
            'DEPRECATED_KEYS_DIR is required'
        )
    }

    return path.resolve(cwd, configuredDir)
}

export function getDeprecatedKeyPath(filename, options = {}) {
    if (!filename || path.basename(filename) !== filename) {
        throw configurationError(
            'deprecated_key_filename_invalid',
            'Deprecated key filename must be a single file name'
        )
    }

    return path.join(getDeprecatedKeysDir(options), filename)
}

export async function loadDeprecatedKeysModule(filename, {
    env = process.env,
    cwd = process.cwd(),
    importModule = moduleUrl => import(moduleUrl)
} = {}) {
    const modulePath = getDeprecatedKeyPath(filename, {env, cwd})

    try {
        return await importModule(pathToFileURL(modulePath).href)
    } catch (cause) {
        throw configurationError(
            'deprecated_keys_module_unavailable',
            `Unable to load deprecated keys module: ${modulePath}`,
            cause
        )
    }
}
