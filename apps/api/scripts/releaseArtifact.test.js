import {afterEach, describe, expect, it} from 'vitest'
import {execFileSync} from 'node:child_process'
import {mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {gunzipSync} from 'node:zlib'
import {inspectTar, validatePath, verifyReleaseInput} from './releaseArtifact.js'

const temporary = []
const apiRoot = fileURLToPath(new URL('../', import.meta.url))

function fixture(extra) {
    const directory = mkdtempSync(path.join(tmpdir(), 'api-release-test-'))
    temporary.push(directory)
    const source = path.join(directory, 'source')
    mkdirSync(source)
    for (const name of [
        '.nvmrc',
        'src/lpubeltsApiServer.js', 'ecosystem.prod.json', 'ecosystem.dev.json',
        'scripts/runCollectionExportAnalysis.js', 'scripts/runFetchAnalyzeLogs.js'
    ]) {
        mkdirSync(path.dirname(path.join(source, name)), {recursive: true})
        writeFileSync(path.join(source, name), readFileSync(path.join(apiRoot, name)))
    }
    const manifest = {name: 'lpubeltsapiserver', version: '1.0.0', main: 'src/lpubeltsApiServer.js', dependencies: {sharp: '^0.35.4'}}
    writeFileSync(path.join(source, 'package.json'), JSON.stringify(manifest))
    writeFileSync(path.join(source, 'package-lock.json'), JSON.stringify({
        name: manifest.name, lockfileVersion: 3,
        packages: {'': manifest, 'node_modules/sharp': {version: '0.35.4'}}
    }))
    writeFileSync(path.join(source, '.npmrc'), 'install-strategy=nested\n')
    writeFileSync(path.join(source, '.release-inputs.json'), JSON.stringify({monorepoCommit: 'a'.repeat(40), monorepoLockSha256: 'b'.repeat(64)}))
    mkdirSync(path.join(source, 'node_modules/sharp'), {recursive: true})
    writeFileSync(path.join(source, 'node_modules/sharp/package.json'), '{"name":"sharp","version":"0.35.4"}')
    extra?.(source)
    const archive = path.join(directory, 'release.tar')
    // Explicit paths match git archive: no leading './' pseudo-root.
    execFileSync('tar', ['-cf', archive, 'package.json', 'package-lock.json', '.npmrc', '.release-inputs.json', '.nvmrc', 'src', 'scripts', 'ecosystem.prod.json', 'ecosystem.dev.json', 'node_modules'], {cwd: source})
    return readFileSync(archive)
}

afterEach(() => {
    for (const directory of temporary.splice(0)) rmSync(directory, {recursive: true, force: true})
})

describe('committed release inputs', () => {
    it('verifies lockfiles larger than the child-process output buffer and rejects byte changes', () => {
        const directory = mkdtempSync(path.join(tmpdir(), 'api-release-input-test-'))
        temporary.push(directory)
        const git = args => execFileSync('git', args, {cwd: directory, encoding: 'utf8'}).trim()
        git(['init', '--quiet'])
        const filename = 'package-lock.json'
        const contents = `${JSON.stringify({lockfileVersion: 3, padding: 'x'.repeat(2 * 1024 * 1024)})}\n`
        writeFileSync(path.join(directory, filename), contents)
        git(['add', filename])
        git(['-c', 'user.name=Release Test', '-c', 'user.email=release@example.test',
            '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Synthetic release input'])
        const commit = git(['rev-parse', 'HEAD'])

        expect(() => verifyReleaseInput(directory, commit, filename)).not.toThrow()
        writeFileSync(path.join(directory, filename), contents.replace('xxx', 'xxy'))
        expect(() => verifyReleaseInput(directory, commit, filename))
            .toThrow(`Uncommitted dependency input: ${filename}`)
        writeFileSync(path.join(directory, filename), contents.trimEnd())
        expect(() => verifyReleaseInput(directory, commit, filename))
            .toThrow(`Uncommitted dependency input: ${filename}`)
    })
})

describe('standalone API release archive', () => {
    it('packages required hoisted dependencies from a synthetic monorepo', () => {
        const directory = mkdtempSync(path.join(tmpdir(), 'api-release-create-test-'))
        temporary.push(directory)
        const archive = path.join(directory, 'fixture.tar')
        writeFileSync(archive, fixture(source => {
            writeFileSync(path.join(source, 'node_modules/sharp/package.json'), JSON.stringify({
                name: 'sharp', version: '0.35.4', dependencies: {long: '^5.3.2'}
            }))
        }))
        const application = path.join(directory, 'apps/api')
        mkdirSync(application, {recursive: true})
        execFileSync('tar', ['-xf', archive, '-C', application])
        for (const filename of ['releaseArtifact.js', 'releaseInputs.js']) {
            writeFileSync(path.join(application, 'scripts', filename), readFileSync(path.join(apiRoot, 'scripts', filename)))
        }
        const manifest = JSON.parse(readFileSync(path.join(application, 'package.json')))
        manifest.type = 'module'
        manifest.packageManager = 'npm@11.19.0'
        writeFileSync(path.join(application, 'package.json'), JSON.stringify(manifest))
        writeFileSync(path.join(directory, 'package.json'), JSON.stringify({
            workspaces: ['apps/api'], packageManager: manifest.packageManager
        }))
        writeFileSync(path.join(directory, 'package-lock.json'), JSON.stringify({
            lockfileVersion: 3, packages: {
                'apps/api': manifest,
                'apps/api/node_modules/sharp': {version: '0.35.4', dependencies: {long: '^5.3.2'}},
                'node_modules/long': {version: '5.3.2'}
            }
        }))
        writeFileSync(path.join(directory, '.npmrc'), 'install-strategy=nested\n')
        writeFileSync(path.join(directory, '.nvmrc'), readFileSync(path.join(application, '.nvmrc')))
        const dependency = path.join(directory, 'node_modules/long')
        mkdirSync(dependency, {recursive: true})
        writeFileSync(path.join(dependency, 'package.json'), '{"name":"long","version":"5.3.2"}')
        const git = args => execFileSync('git', args, {cwd: directory, encoding: 'utf8'}).trim()
        git(['init', '--quiet'])
        git(['add', 'package.json', 'package-lock.json', '.npmrc', '.nvmrc', 'apps/api'])
        git(['-c', 'user.name=Release Test', '-c', 'user.email=release@example.test',
            '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Synthetic monorepo'])
        const output = path.join(directory, 'release.tar.gz')
        // This fixture tests packaging, independently of the developer's installed npm.
        const bin = path.join(directory, 'bin')
        mkdirSync(bin)
        const npm = path.join(bin, 'npm')
        const npmStub = version => `#!/bin/sh\n[ "$#" -eq 1 ] && [ "$1" = "--version" ] || exit 1\nprintf '%s\\n' '${version}'\n`
        writeFileSync(npm, npmStub('11.19.0'), {mode: 0o755})
        const options = {env: {...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`}, stdio: 'pipe'}
        const command = [path.join(application, 'scripts/releaseArtifact.js'),
            'create', git(['rev-parse', 'HEAD']), output]
        execFileSync(process.execPath, command, options)
        const members = inspectTar(gunzipSync(readFileSync(output)))
        expect(JSON.parse(members.get('node_modules/long/package.json').data).version).toBe('5.3.2')
        expect(JSON.parse(members.get('package-lock.json').data).packages['node_modules/long'].version).toBe('5.3.2')
        writeFileSync(npm, npmStub('11.0.0'))
        expect(() => execFileSync(process.execPath, command, options))
            .toThrow('Release npm does not match the common pin: expected npm@11.19.0, got npm@11.0.0')
    })

    it('accepts the package-root layout with dependencies and an internal dependency link', () => {
        const members = inspectTar(fixture(source => {
            mkdirSync(path.join(source, 'node_modules/.bin'))
            symlinkSync('../sharp/package.json', path.join(source, 'node_modules/.bin/sharp'))
        }))
        expect(members.has('src/lpubeltsApiServer.js')).toBe(true)
        expect(members.has('apps/api/package.json')).toBe(false)
    })

    it.each(['/tmp/escape', '../escape', './package.json', 'src//file', '.', 'src/../../escape', 'apps/web/package.json', '.env.production', 'shared/file', 'keys/file', '.git/config', '.yarn/install-state.gz', '.release.json', 'yarn.lock', '.yarnrc.yml'])(
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

    it('rejects a dependency not paired with the release lock', () => {
        const archive = fixture(source => writeFileSync(path.join(source, 'node_modules/sharp/package.json'), '{"name":"sharp","version":"9.0.0"}'))
        expect(() => inspectTar(archive)).toThrow('Unmatched production dependency')
    })

    it('rejects a missing transitive runtime dependency', () => {
        const archive = fixture(source => writeFileSync(path.join(source, 'node_modules/sharp/package.json'), '{"name":"sharp","version":"0.35.4","dependencies":{"missing":"1.0.0"}}'))
        expect(() => inspectTar(archive)).toThrow('Missing production dependency: missing')
    })

    it('rejects development dependencies in a production archive', () => {
        const archive = fixture(source => {
            const file = path.join(source, 'package-lock.json')
            const lock = JSON.parse(readFileSync(file))
            lock.packages['node_modules/sharp'].dev = true
            writeFileSync(file, JSON.stringify(lock))
        })
        expect(() => inspectTar(archive)).toThrow('Unmatched production dependency')
    })

    it('rejects corrupt headers', () => {
        const archive = fixture()
        archive[0] ^= 1
        expect(() => inspectTar(archive)).toThrow('Invalid tar header checksum')
    })
})
