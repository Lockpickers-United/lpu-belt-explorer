import {isDeepStrictEqual} from 'node:util'

export function resolvePackage(location, name, packages) {
    let directory = location
    while (true) {
        if (!directory.endsWith('/node_modules') && directory !== 'node_modules') {
            const candidate = `${directory ? `${directory}/` : ''}node_modules/${name}`
            if (packages.has(candidate)) return candidate
        }
        if (!directory) return null
        const slash = directory.lastIndexOf('/')
        directory = slash < 0 ? '' : directory.slice(0, slash)
    }
}

export function createReleaseInputs(rootManifest, sharedLock, apiManifest) {
    if (!rootManifest.workspaces?.includes('apps/api') || !rootManifest.packageManager?.startsWith('npm@')
        || apiManifest.packageManager !== rootManifest.packageManager) {
        throw new Error('API release requires the pinned npm workspace')
    }
    const workspace = sharedLock.packages?.['apps/api']
    for (const field of ['dependencies', 'devDependencies', 'engines']) {
        if (!isDeepStrictEqual(workspace?.[field] || {}, apiManifest[field] || {})) {
            throw new Error(`API workspace lock mismatch: ${field}`)
        }
    }
    const packages = {'': {...workspace}}
    for (const [location, entry] of Object.entries(sharedLock.packages)) {
        if (!location.startsWith('apps/api/node_modules/')) continue
        if (entry.link) throw new Error('API runtime dependencies must not link outside the package')
        packages[location.slice('apps/api/'.length)] = entry
    }
    const locations = new Set(Object.keys(packages))
    for (const [location, entry] of Object.entries(packages)) {
        if (entry.dev) continue
        for (const name of Object.keys(entry.dependencies || {})) {
            if (name in (entry.optionalDependencies || {})) continue
            if (!resolvePackage(location, name, locations)) {
                throw new Error(`API dependency is hoisted outside the release: ${name}`)
            }
        }
    }
    return {
        manifest: {...apiManifest, overrides: rootManifest.overrides || {}},
        lock: {
            name: apiManifest.name,
            version: apiManifest.version,
            lockfileVersion: sharedLock.lockfileVersion,
            requires: true,
            packages
        }
    }
}
