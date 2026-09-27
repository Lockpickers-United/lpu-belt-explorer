import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {loadReleaseMetadata} from './releaseMetadata.js'

const directories = []

afterEach(() => {
    directories.splice(0).forEach(directory => fs.rmSync(directory, {recursive: true, force: true}))
})

describe('loadReleaseMetadata', () => {
    it('loads deployment metadata from the release directory', () => {
        const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'release-metadata-'))
        directories.push(projectRoot)
        fs.writeFileSync(path.join(projectRoot, '.release.json'), JSON.stringify({
            releaseId: `${'a'.repeat(40)}-12-1`,
            gitSha: 'a'.repeat(40)
        }))

        expect(loadReleaseMetadata({env: {NODE_ENV: 'production'}, projectRoot})).toEqual({
            releaseId: `${'a'.repeat(40)}-12-1`,
            gitSha: 'a'.repeat(40)
        })
    })

    it('fails closed when production release metadata is absent', () => {
        const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'release-metadata-'))
        directories.push(projectRoot)
        expect(() => loadReleaseMetadata({env: {NODE_ENV: 'production'}, projectRoot}))
            .toThrow(/Unable to load release metadata/)
    })

    it('uses an explicit local release identity', () => {
        expect(loadReleaseMetadata({
            env: {
                NODE_ENV: 'development',
                APP_RELEASE_ID: 'development-test',
                APP_GIT_SHA: 'b'.repeat(40)
            }
        })).toEqual({releaseId: 'development-test', gitSha: 'b'.repeat(40)})
    })
})
