import fs from 'node:fs'
import path from 'node:path'

function metadataError(code, message, cause) {
    const error = new Error(message)
    error.code = code
    if (cause) error.cause = cause
    return error
}

function validateMetadata(metadata) {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)
        || typeof metadata.releaseId !== 'string' || !metadata.releaseId.trim()
        || typeof metadata.gitSha !== 'string' || !/^[0-9a-f]{40}$/i.test(metadata.gitSha)) {
        throw metadataError(
            'release_metadata_invalid',
            'Release metadata must contain a releaseId and 40-character gitSha'
        )
    }
    return Object.freeze({
        releaseId: metadata.releaseId.trim(),
        gitSha: metadata.gitSha.toLowerCase()
    })
}

export function loadReleaseMetadata({env = process.env, projectRoot = process.cwd()} = {}) {
    if (env.APP_RELEASE_ID?.trim() || env.APP_GIT_SHA?.trim()) {
        return validateMetadata({
            releaseId: env.APP_RELEASE_ID,
            gitSha: env.APP_GIT_SHA
        })
    }

    const metadataPath = path.join(projectRoot, '.release.json')
    try {
        return validateMetadata(JSON.parse(fs.readFileSync(metadataPath, 'utf8')))
    } catch (cause) {
        if (env.NODE_ENV === 'production') {
            if (cause?.code === 'release_metadata_invalid') throw cause
            throw metadataError(
                'release_metadata_unavailable',
                `Unable to load release metadata from ${metadataPath}`,
                cause
            )
        }
    }

    return Object.freeze({
        releaseId: `${env.NODE_ENV || 'local'}-unversioned`,
        gitSha: null
    })
}
