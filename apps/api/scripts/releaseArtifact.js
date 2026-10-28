import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {readFileSync, writeFileSync, mkdtempSync, rmSync, realpathSync, mkdirSync, cpSync, readdirSync} from 'node:fs'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {gunzipSync, gzipSync} from 'node:zlib'
import {isDeepStrictEqual} from 'node:util'
import {createReleaseInputs, resolvePackage} from './releaseInputs.js'

const apiRoot = fileURLToPath(new URL('../', import.meta.url))
const required = [
    'package.json', 'package-lock.json', '.npmrc', '.nvmrc', '.release-inputs.json',
    'src/lpubeltsApiServer.js', 'ecosystem.prod.json', 'ecosystem.dev.json',
    'scripts/runCollectionExportAnalysis.js', 'scripts/runFetchAnalyzeLogs.js'
]

function fail(message) {
    throw new Error(message)
}

export function validatePath(name) {
    if (!name || name.startsWith('/') || name.includes('\\') || name.split('/').includes('..')) {
        fail('Unsafe archive path')
    }
    const parts = name.replace(/\/$/, '').split('/')
    if (parts.some(part => part === '.' || part === '')) fail('Noncanonical archive path')
    if (parts.some(part => ['.git', 'keys', 'credentials'].includes(part)) ||
        ['apps', 'shared', 'logs'].includes(parts[0]) ||
        (parts[0].startsWith('.env') && name !== '.env.example') ||
        name === '.release.json' || name === '.yarn/install-state.gz' || name === 'yarn.lock' || name === '.yarnrc.yml') {
        fail(`Excluded runtime or repository state: ${name}`)
    }
}

function parsePax(data) {
    const fields = {}
    let offset = 0
    while (offset < data.length) {
        const space = data.indexOf(32, offset)
        const length = Number(data.subarray(offset, space).toString())
        if (space < offset || !Number.isInteger(length) || length <= 0 || offset + length > data.length) {
            fail('Invalid extended tar header')
        }
        const record = data.subarray(space + 1, offset + length - 1).toString()
        const equals = record.indexOf('=')
        if (equals < 1) fail('Invalid extended tar record')
        fields[record.slice(0, equals)] = record.slice(equals + 1)
        offset += length
    }
    return fields
}

// Inspect names and links before allowing any extraction. Supports Git's PAX
// metadata and GNU tar's long-name/link records without an added dependency.
export function inspectTar(buffer, {dependencies = true} = {}) {
    if (buffer.length % 512 !== 0) fail('Truncated tar archive')
    const members = new Map()
    let extended = {}
    let globalFields = {}
    let offset = 0
    const string = bytes => bytes.toString().replace(/\0.*$/s, '')
    while (offset + 512 <= buffer.length) {
        const header = buffer.subarray(offset, offset + 512)
        if (header.every(byte => byte === 0)) break
        const size = Number.parseInt(string(header.subarray(124, 136)).trim() || '0', 8)
        if (!Number.isSafeInteger(size) || size < 0) fail('Invalid tar size')
        const checksum = Number.parseInt(string(header.subarray(148, 156)).trim(), 8)
        const actual = header.reduce((sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte), 0)
        if (checksum !== actual) fail('Invalid tar header checksum')
        const data = buffer.subarray(offset + 512, offset + 512 + size)
        if (data.length !== size) fail('Truncated tar member')
        offset += 512 + Math.ceil(size / 512) * 512
        const type = string(header.subarray(156, 157)) || '0'
        if (type === 'g') {
            globalFields = {...globalFields, ...parsePax(data)}
            continue
        }
        if (type === 'x') {
            extended = {...extended, ...parsePax(data)}
            continue
        }
        if (type === 'L' || type === 'K') {
            extended[type === 'L' ? 'path' : 'linkpath'] = string(data)
            continue
        }
        const fields = {...globalFields, ...extended}
        const prefix = string(header.subarray(345, 500))
        const rawName = string(header.subarray(0, 100))
        const name = fields.path || (prefix ? `${prefix}/${rawName}` : rawName)
        const link = fields.linkpath || string(header.subarray(157, 257))
        extended = {}
        validatePath(name)
        if (!['0', '1', '2', '5'].includes(type)) fail('Unsupported tar member type')
        if (members.has(name.replace(/\/$/, ''))) fail(`Duplicate tar member: ${name}`)
        if (type === '1' || type === '2') {
            if (path.posix.isAbsolute(link) || link.includes('\\')) fail('Unsafe archive link')
            const target = path.posix.normalize(type === '1' ? link : path.posix.join(path.posix.dirname(name), link))
            validatePath(target)
            if (target === '.' || target === '..') fail('Unsafe archive link target')
        }
        members.set(name.replace(/\/$/, ''), {type, data, link})
    }
    // Disallow writing through a link regardless of member ordering.
    for (const name of members.keys()) {
        let parent = path.posix.dirname(name)
        while (parent !== '.') {
            if (['1', '2'].includes(members.get(parent)?.type)) fail('Archive member descends through a link')
            parent = path.posix.dirname(parent)
        }
    }
    for (const name of required) {
        if (members.get(name)?.type !== '0') fail(`Missing release file: ${name}`)
    }
    const manifest = JSON.parse(members.get('package.json').data)
    if (manifest.name !== 'lpubeltsapiserver' || manifest.main !== 'src/lpubeltsApiServer.js') fail('Wrong API package')
    for (const filename of ['ecosystem.dev.json', 'ecosystem.prod.json']) {
        const config = JSON.parse(members.get(filename).data)
        const expectedRoot = filename === 'ecosystem.prod.json'
            ? '/home/lpubelts_api/apps/api-server-prod/current'
            : '/home/lpubelts_api/apps/api-server-dev/current-dev'
        if (!config.apps.some(app => app.cwd === expectedRoot && app.script === `${expectedRoot}/src/lpubeltsApiServer.js`)) fail('Wrong PM2 entry point')
    }
    const lock = JSON.parse(members.get('package-lock.json').data)
    if (lock.name !== manifest.name || !isDeepStrictEqual(lock.packages?.['']?.dependencies, manifest.dependencies)) fail('Release lock does not match the API manifest')
    const identity = JSON.parse(members.get('.release-inputs.json').data)
    if (!/^[0-9a-f]{40}$/.test(identity.monorepoCommit || '') || !/^[0-9a-f]{64}$/.test(identity.monorepoLockSha256 || '')) fail('Missing monorepo release identity')
    if (dependencies) {
        if (!members.has('node_modules/sharp/package.json')) fail('Missing Sharp dependency')
        const installed = new Map()
        for (const [name, member] of members) {
            if (!name.startsWith('node_modules/') || !name.endsWith('/package.json') || member.type !== '0') continue
            const parts = name.split('/')
            const tail = parts.slice(parts.lastIndexOf('node_modules') + 1)
            if (!(tail.length === 2 && !tail[0].startsWith('@')) && !(tail.length === 3 && tail[0].startsWith('@'))) continue
            const location = name.slice(0, -'/package.json'.length)
            const entry = lock.packages[location]
            const actual = JSON.parse(member.data)
            if (!entry || entry.version !== actual.version || entry.dev) fail(`Unmatched production dependency: ${location}`)
            installed.set(location, actual)
        }
        for (const [location, actual] of [['', manifest], ...installed]) {
            for (const name of Object.keys(actual.dependencies || {})) {
                if (name in (actual.optionalDependencies || {})) continue
                if (!resolvePackage(location, name, installed)) fail(`Missing production dependency: ${name}`)
            }
        }
    }
    return members
}

export function verifyReleaseInput(repository, commit, filename) {
    const committed = execFileSync('git', ['rev-parse', '--verify', `${commit}:${filename}`], {
        cwd: repository, encoding: 'utf8'
    }).trim()
    // Compare exact blob identities without buffering the committed lockfile on stdout.
    const working = execFileSync('git', ['hash-object', '--no-filters', '--stdin'], {
        cwd: repository, encoding: 'utf8', input: readFileSync(path.join(repository, filename))
    }).trim()
    if (committed !== working) fail(`Uncommitted dependency input: ${filename}`)
}

function createArtifact(commit, output) {
    if (!/^[0-9a-f]{40}$/.test(commit || '')) fail('Supply an exact monorepo commit SHA')
    const repository = execFileSync('git', ['rev-parse', '--show-toplevel'], {cwd: apiRoot, encoding: 'utf8'}).trim()
    execFileSync('git', ['rev-parse', '--verify', `${commit}^{commit}`], {cwd: repository})
    const prefix = path.relative(repository, apiRoot).split(path.sep).join('/')
    if (prefix !== 'apps/api') fail('Expected apps/api package boundary')
    // Verify every install input against the exact source revision. No server install is needed.
    for (const filename of ['package.json', 'package-lock.json', '.npmrc', '.nvmrc', 'apps/api/package.json', 'apps/api/.nvmrc']) {
        verifyReleaseInput(repository, commit, filename)
    }
    const rootManifest = JSON.parse(readFileSync(path.join(repository, 'package.json')))
    const sharedLockBytes = readFileSync(path.join(repository, 'package-lock.json'))
    const apiManifest = JSON.parse(readFileSync(path.join(apiRoot, 'package.json')))
    const projected = createReleaseInputs(rootManifest, JSON.parse(sharedLockBytes), apiManifest)
    const requiredNode = readFileSync(path.join(repository, '.nvmrc'), 'utf8').trim().replace(/^v/, '')
    if (readFileSync(path.join(apiRoot, '.nvmrc'), 'utf8').trim().replace(/^v/, '') !== requiredNode || process.version !== `v${requiredNode}`) fail('Release Node does not match the common pin')
    const npmVersion = execFileSync('npm', ['--version'], {cwd: repository, encoding: 'utf8'}).trim()
    if (`npm@${npmVersion}` !== rootManifest.packageManager) {
        fail(`Release npm does not match the common pin: expected ${rootManifest.packageManager}, got npm@${npmVersion}`)
    }
    const temporary = mkdtempSync(path.join(tmpdir(), 'lpu-api-artifact-'))
    try {
        const archive = path.join(temporary, 'release.tar')
        const source = path.join(temporary, 'source.tar')
        const stage = path.join(temporary, 'package')
        mkdirSync(stage)
        execFileSync('git', ['archive', '--format=tar', `--output=${source}`, `${commit}:apps/api`], {cwd: repository})
        execFileSync('tar', ['-xf', source, '-C', stage])
        writeFileSync(path.join(stage, 'package.json'), `${JSON.stringify(projected.manifest, null, 2)}\n`)
        writeFileSync(path.join(stage, 'package-lock.json'), `${JSON.stringify(projected.lock, null, 2)}\n`)
        writeFileSync(path.join(stage, '.npmrc'), 'install-strategy=nested\n')
        writeFileSync(path.join(stage, '.release-inputs.json'), `${JSON.stringify({
            monorepoCommit: commit,
            monorepoLockSha256: createHash('sha256').update(sharedLockBytes).digest('hex'),
            sourceApiManifestSha256: createHash('sha256').update(readFileSync(path.join(apiRoot, 'package.json'))).digest('hex'),
            nodeVersion: requiredNode,
            npmVersion,
            installStrategy: 'nested'
        }, null, 2)}\n`)
        cpSync(path.join(apiRoot, 'node_modules'), path.join(stage, 'node_modules'), {recursive: true, verbatimSymlinks: true})
        for (const location of projected.hoistedPackages) {
            cpSync(path.join(repository, location), path.join(stage, location), {recursive: true, verbatimSymlinks: true})
        }
        rmSync(path.join(stage, 'node_modules', '.package-lock.json'), {force: true})
        execFileSync('tar', ['-cf', archive, '-C', stage, '--', ...readdirSync(stage).sort()])
        const buffer = readFileSync(archive)
        inspectTar(buffer)
        const compressed = gzipSync(buffer)
        writeFileSync(output, compressed, {flag: 'wx'})
        writeFileSync(`${output}.sha256`, `${createHash('sha256').update(compressed).digest('hex')}\n`, {flag: 'wx'})
        console.log(`Validated API release artifact: ${output}`)
    } finally {
        rmSync(temporary, {recursive: true, force: true})
    }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const [command, first, second] = process.argv.slice(2)
    if (command === 'create' && second) createArtifact(first, path.resolve(second))
    else if (command === 'inspect' && first) {
        const members = inspectTar(gunzipSync(readFileSync(first)))
        console.log(`Validated ${members.size} API artifact members`)
    } else fail('Usage: node scripts/releaseArtifact.js create COMMIT OUTPUT | inspect ARCHIVE')
}
