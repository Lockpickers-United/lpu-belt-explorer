import fs from 'node:fs/promises'
import {constants} from 'node:fs'

export function createReadinessController({
    releaseMetadata,
    environment,
    requiredFiles = [],
    accessFile = filePath => fs.access(filePath, constants.R_OK)
}) {
    let ready = false
    let reason = 'starting'

    async function handler(_req, res) {
        const identity = {
            releaseId: releaseMetadata.releaseId,
            gitSha: releaseMetadata.gitSha,
            environment
        }
        if (!ready) return res.status(503).json({ready: false, reason, ...identity})

        try {
            await Promise.all(requiredFiles.map(accessFile))
        } catch {
            return res.status(503).json({
                ready: false,
                reason: 'required_file_unavailable',
                ...identity
            })
        }
        return res.json({ready: true, ...identity})
    }

    return Object.freeze({
        handler,
        markReady() {
            ready = true
            reason = undefined
        },
        markNotReady(nextReason = 'shutting_down') {
            ready = false
            reason = nextReason
        }
    })
}
