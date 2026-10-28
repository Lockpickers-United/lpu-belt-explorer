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
    const sources = new Map([['', 'apps/api']])
    for (const [location, entry] of Object.entries(sharedLock.packages)) {
        if (!location.startsWith('apps/api/node_modules/')) continue
        if (entry.link) throw new Error('API runtime dependencies must not link outside the package')
        packages[location.slice('apps/api/'.length)] = entry
        sources.set(location.slice('apps/api/'.length), location)
    }
    const hoistedPackages = new Set()
    const originalLocations = new Set(Object.keys(sharedLock.packages))
    const locations = new Set(Object.keys(packages))
    const pending = Object.keys(packages)
    for (let index = 0; index < pending.length; index++) {
        const location = pending[index]
        const entry = packages[location]
        if (entry.dev) continue
        for (const name of Object.keys({...entry.dependencies, ...entry.optionalDependencies})) {
            const original = resolvePackage(sources.get(location), name, originalLocations)
            if (!original) {
                if (name in (entry.optionalDependencies || {})) continue
                throw new Error(`Missing API release dependency: ${name}`)
            }
            let resolved = resolvePackage(location, name, locations)
            if (!resolved && original.startsWith('node_modules/')) {
                hoistedPackages.add(original)
                for (const [source, dependency] of Object.entries(sharedLock.packages)) {
                    if (source !== original && !source.startsWith(`${original}/node_modules/`)) continue
                    if (dependency.link) throw new Error('API runtime dependencies must not link outside the package')
                    packages[source] = dependency
                    sources.set(source, source)
                    locations.add(source)
                    pending.push(source)
                }
                resolved = resolvePackage(location, name, locations)
            }
            if (!resolved || sources.get(resolved) !== original) {
                throw new Error(`API release dependency resolution changed: ${name}`)
            }
        }
    }
    return {
        hoistedPackages: [...hoistedPackages],
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
