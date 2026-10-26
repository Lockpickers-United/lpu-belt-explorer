import {execFileSync} from 'node:child_process'

const projectId = 'lpu-belt-explorer'
const collections = new Set([
    'classificationVotes', 'classificationEntries', 'classificationEntryStates',
    'classificationActions', 'classificationPublications', 'classificationOperations'
])

function gcloudAccessToken() {
    try {
        const token = execFileSync('gcloud', ['auth', 'print-access-token', '--quiet'], {
            encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
        }).trim()
        if (token) return token
    } catch {
        // Never include CLI output in an error; it may contain credentials.
    }
    throw new Error('Google Cloud CLI authorization is unavailable')
}

function decodeValue(value) {
    if ('nullValue' in value) return null
    if ('booleanValue' in value) return value.booleanValue
    if ('integerValue' in value) {
        const integer = Number(value.integerValue)
        if (!Number.isSafeInteger(integer)) throw new Error('Unsafe Firestore integer')
        return integer
    }
    if ('doubleValue' in value) return value.doubleValue
    if ('timestampValue' in value) return new Date(value.timestampValue)
    if ('stringValue' in value) return value.stringValue
    if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(decodeValue)
    if ('mapValue' in value) return decodeFields(value.mapValue.fields ?? {})
    throw new Error('Unsupported Firestore value type')
}

function decodeFields(fields) {
    return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]))
}

function encodeValue(value) {
    if (value === null) return {nullValue: null}
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) throw new Error('Invalid Firestore date')
        return {timestampValue: value.toISOString()}
    }
    if (typeof value === 'string') return {stringValue: value}
    if (typeof value === 'boolean') return {booleanValue: value}
    if (typeof value === 'number' && Number.isFinite(value)) {
        if (Number.isInteger(value)) {
            if (!Number.isSafeInteger(value)) throw new Error('Unsafe Firestore integer')
            return {integerValue: String(value)}
        }
        return {doubleValue: value}
    }
    if (Array.isArray(value)) return {arrayValue: {values: value.map(encodeValue)}}
    if (value && typeof value === 'object') return {mapValue: {fields: encodeFields(value)}}
    throw new Error('Unsupported Firestore value type')
}

function encodeFields(fields) {
    return Object.fromEntries(Object.entries(fields)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, encodeValue(value)]))
}

export function createClassificationGcloudDb({
    fetchImpl = globalThis.fetch,
    accessTokenProvider = gcloudAccessToken,
    databaseId = 'lpubelts-dev'
} = {}) {
    if (!['lpubelts-dev', '(default)'].includes(databaseId)) {
        throw new Error('Unsupported Classification migration database')
    }
    const basePath = `projects/${projectId}/databases/${databaseId}/documents`
    const baseUrl = `https://firestore.googleapis.com/v1/${basePath}`
    let accessToken
    async function request(url, options = {}) {
        accessToken ??= accessTokenProvider()
        const response = await fetchImpl(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ...(options.body ? {'Content-Type': 'application/json'} : {})
            }
        })
        if (!response.ok) throw new Error(`Firestore ${options.method ?? 'GET'} returned HTTP ${response.status}`)
        return response.json()
    }

    return {
        collection(collection) {
            if (!collections.has(collection)) throw new Error('Unexpected Classification collection')
            return {
                doc(id) {
                    if (typeof id !== 'string' || !id || id.includes('/')) {
                        throw new Error('Invalid Classification document ID')
                    }
                    return {name: `${basePath}/${collection}/${id}`}
                },
                async get() {
                    const docs = []
                    const seenPages = new Set()
                    let pageToken
                    do {
                        const url = new URL(`${baseUrl}/${collection}`)
                        url.searchParams.set('pageSize', '1000')
                        if (pageToken) url.searchParams.set('pageToken', pageToken)
                        const page = await request(url)
                        for (const document of page.documents ?? []) {
                            const prefix = `${basePath}/${collection}/`
                            if (!document.name?.startsWith(prefix)) {
                                throw new Error('Unexpected Firestore document path')
                            }
                            const id = document.name.slice(prefix.length)
                            if (!id || id.includes('/')) throw new Error('Unexpected nested Firestore document')
                            const data = decodeFields(document.fields ?? {})
                            docs.push({id, data: () => data})
                        }
                        pageToken = page.nextPageToken
                        if (pageToken) {
                            if (seenPages.has(pageToken)) throw new Error('Repeated Firestore page token')
                            seenPages.add(pageToken)
                        }
                    } while (pageToken)
                    return {docs}
                }
            }
        },
        batch() {
            const writes = []
            return {
                create(ref, data) {
                    if (writes.length >= 500) throw new Error('Firestore batch exceeds 500 writes')
                    writes.push({
                        update: {name: ref.name, fields: encodeFields(data)},
                        currentDocument: {exists: false}
                    })
                },
                async commit() {
                    if (!writes.length) return
                    const body = JSON.stringify({writes})
                    if (Buffer.byteLength(body) > 9 * 1024 * 1024) {
                        throw new Error('Firestore batch exceeds the payload limit')
                    }
                    const result = await request(`${baseUrl}:commit`, {method: 'POST', body})
                    if (result.writeResults?.length !== writes.length) {
                        throw new Error('Firestore commit returned an unexpected write count')
                    }
                }
            }
        }
    }
}
