import {afterEach, describe, expect, it} from 'vitest'
import {execFileSync} from 'node:child_process'
import {mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {inspectTar, validatePath} from './releaseArtifact.js'

const temporary = []
const apiRoot = fileURLToPath(new URL('../', import.meta.url))

function fixture(extra) {
    const directory = mkdtempSync(path.join(tmpdir(), 'api-release-test-'))
    temporary.push(directory)
    const source = path.join(directory, 'source')
    mkdirSync(source)
    for (const name of [
        'package.json', 'yarn.lock', '.yarnrc.yml', '.nvmrc',
        'src/lpubeltsApiServer.js', 'ecosystem.prod.json', 'ecosystem.dev.json',
        'scripts/runCollectionExportAnalysis.js', 'scripts/runFetchAnalyzeLogs.js'
    ]) {
        mkdirSync(path.dirname(path.join(source, name)), {recursive: true})
        writeFileSync(path.join(source, name), readFileSync(path.join(apiRoot, name)))
    }
    mkdirSync(path.join(source, 'node_modules/sharp'), {recursive: true})
    writeFileSync(path.join(source, 'node_modules/sharp/package.json'), '{}')
    extra?.(source)
    const archive = path.join(directory, 'release.tar')
    // Explicit paths match git archive: no leading './' pseudo-root.
    execFileSync('tar', ['-cf', archive, 'package.json', 'yarn.lock', '.yarnrc.yml', '.nvmrc', 'src', 'scripts', 'ecosystem.prod.json', 'ecosystem.dev.json', 'node_modules'], {cwd: source})
    return readFileSync(archive)
}

afterEach(() => {
    for (const directory of temporary.splice(0)) rmSync(directory, {recursive: true, force: true})
})

describe('standalone API release archive', () => {
    it('accepts the package-root layout with dependencies and an internal dependency link', () => {
        const members = inspectTar(fixture(source => {
            mkdirSync(path.join(source, 'node_modules/.bin'))
            symlinkSync('../sharp/package.json', path.join(source, 'node_modules/.bin/sharp'))
        }))
        expect(members.has('src/lpubeltsApiServer.js')).toBe(true)
        expect(members.has('apps/api/package.json')).toBe(false)
    })

    it.each(['/tmp/escape', '../escape', './package.json', 'src//file', '.', 'src/../../escape', 'apps/web/package.json', '.env.production', 'shared/file', 'keys/file', '.git/config', '.yarn/install-state.gz', '.release.json'])(
        'rejects excluded path %s', name => expect(() => validatePath(name)).toThrow()
    )

    it('permits the reviewed template', () => expect(() => validatePath('.env.example')).not.toThrow())

    it('rejects escaping symlinks before extraction', () => {
        const archive = fixture(source => symlinkSync('../../../outside', path.join(source, 'node_modules/escape')))
        expect(() => inspectTar(archive)).toThrow('Unsafe archive path')
    })

    it('rejects missing production dependencies', () => {
        const archive = fixture(source => rmSync(path.join(source, 'node_modules/sharp'), {recursive: true}))
        expect(() => inspectTar(archive)).toThrow('Missing Sharp dependency')
    })

    it('rejects the wrong package at artifact root', () => {
        const archive = fixture(source => writeFileSync(path.join(source, 'package.json'), '{"name":"web"}'))
        expect(() => inspectTar(archive)).toThrow('Wrong API package')
    })

    it('accepts extended archive member names', () => {
        const name = `node_modules/sharp/${'x'.repeat(180)}.js`
        const archive = fixture(source => writeFileSync(path.join(source, name), 'export default 1'))
        expect(inspectTar(archive).has(name)).toBe(true)
    })

    it('rejects corrupt headers', () => {
        const archive = fixture()
        archive[0] ^= 1
        expect(() => inspectTar(archive)).toThrow('Invalid tar header checksum')
    })
})
