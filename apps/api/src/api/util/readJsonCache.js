import fs from 'node:fs/promises'

const cache = new Map()

export async function readJsonCached(filePath) {
    const stat = await fs.stat(filePath)
    const cached = cache.get(filePath)

    if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
        return cached.data
    }

    const data = JSON.parse(await fs.readFile(filePath, 'utf8'))
    cache.set(filePath, {
        data,
        mtimeMs: stat.mtimeMs,
        size: stat.size
    })
    return data
}
