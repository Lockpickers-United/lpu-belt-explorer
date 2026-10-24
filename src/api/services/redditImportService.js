import {createHash, randomBytes} from 'node:crypto'
import {Timestamp} from 'firebase-admin/firestore'

const stateLifetimeMs = 10 * 60_000
const pageSize = 100
const maxPages = 5
const maxResponseBytes = 256 * 1024
const requestTimeoutMs = 8_000
const importTimeoutMs = 30_000
const stateCollection = 'redditOAuthStates'

function apiError(status, code, message) {
    const error = new Error(message)
    error.status = status
    error.code = code
    return error
}

function hash(value) {
    return createHash('sha256').update(value).digest('hex')
}

function requireConfig(config) {
    if (!config.clientId || !config.clientSecret || !config.userAgent || !config.redirectUri) {
        throw apiError(503, 'reddit_not_configured', 'Reddit import is unavailable')
    }
    try {
        const url = new URL(config.redirectUri)
        if (url.toString() !== config.redirectUri || url.pathname !== '/' || url.search || url.hash ||
            (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost'))) {
            throw new Error('Invalid redirect URI')
        }
    } catch {
        throw apiError(503, 'reddit_not_configured', 'Reddit import is unavailable')
    }
}

function requestFailure(response, code) {
    if (response.status === 429) {
        return apiError(429, 'reddit_rate_limited', 'Reddit is rate limiting imports; try again later')
    }
    return apiError(502, code, 'Reddit import is unavailable')
}

async function requestJson(fetcher, url, options, code, deadline = Infinity) {
    const remaining = deadline - Date.now()
    if (remaining <= 0) throw apiError(504, 'reddit_timeout', 'Reddit did not respond in time')
    let response
    try {
        response = await fetcher(url, {...options,
            signal: AbortSignal.timeout(Math.min(requestTimeoutMs, remaining))})
    } catch (error) {
        if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
            throw apiError(504, 'reddit_timeout', 'Reddit did not respond in time')
        }
        throw apiError(502, code, 'Reddit import is unavailable')
    }
    if (!response.ok) throw requestFailure(response, code)
    try {
        const body = await response.text()
        if (Buffer.byteLength(body) > 2 * 1024 * 1024) throw new Error('Response too large')
        return JSON.parse(body)
    } catch {
        throw apiError(502, code, 'Reddit returned invalid import data')
    }
}

function parseUsername(data) {
    if (typeof data?.name !== 'string' || !/^[A-Za-z0-9_-]{3,20}$/.test(data.name)) {
        throw apiError(502, 'reddit_identity_invalid', 'Reddit returned an invalid identity')
    }
    return data.name
}

function parseMessages(data) {
    const children = data?.data?.children
    if (!Array.isArray(children) || children.length > pageSize) {
        throw apiError(502, 'reddit_inbox_invalid', 'Reddit returned an invalid inbox page')
    }
    return children.map(child => {
        const message = child?.data
        if (typeof message?.name !== 'string' || !/^t[0-9]_[A-Za-z0-9]+$/.test(message.name) ||
            !Number.isFinite(message.created_utc)) {
            throw apiError(502, 'reddit_inbox_invalid', 'Reddit returned an invalid inbox page')
        }
        return {...message, kind: child.kind}
    })
}

function basicAuth(config) {
    return `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
}

export function createRedditImportService({db, fetcher = fetch, now = () => Date.now(), config}) {
    const stateRef = state => db.collection(stateCollection).doc(hash(state))

    async function start({uid, purpose, nonce, redirectUri}) {
        requireConfig(config)
        if (!['import', 'debugImport'].includes(purpose)) {
            throw apiError(400, 'reddit_purpose_invalid', 'Invalid Reddit import purpose')
        }
        if (redirectUri !== config.redirectUri) {
            throw apiError(400, 'reddit_redirect_invalid', 'Invalid Reddit redirect URI')
        }
        const state = randomBytes(32).toString('base64url')
        await stateRef(state).create({
            uid, purpose, nonceHash: hash(nonce), redirectUri,
            expiresAt: Timestamp.fromMillis(now() + stateLifetimeMs)
        })
        const url = new URL('https://www.reddit.com/api/v1/authorize')
        url.searchParams.set('client_id', config.clientId)
        url.searchParams.set('response_type', 'code')
        url.searchParams.set('state', state)
        url.searchParams.set('redirect_uri', redirectUri)
        url.searchParams.set('duration', 'temporary')
        url.searchParams.set('scope', 'identity flair privatemessages')
        return {state, authorizeUrl: url.toString()}
    }

    async function exchange({uid, code, state, nonce}) {
        requireConfig(config)
        const saved = await db.runTransaction(async transaction => {
            const ref = stateRef(state)
            const snapshot = await transaction.get(ref)
            if (!snapshot.exists) {
                throw apiError(400, 'reddit_state_invalid', 'Reddit authorization is missing or already used')
            }
            const data = snapshot.data()
            if (!data.expiresAt || data.expiresAt.toMillis() <= now()) {
                throw apiError(400, 'reddit_state_expired', 'Reddit authorization has expired')
            }
            if (data.uid !== uid || data.nonceHash !== hash(nonce)) {
                throw apiError(400, 'reddit_state_invalid', 'Reddit authorization does not match this session')
            }
            transaction.delete(ref)
            return data
        })

        const authorization = basicAuth(config)
        const deadline = Date.now() + importTimeoutMs
        const tokenData = await requestJson(fetcher, 'https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {Authorization: authorization, 'User-Agent': config.userAgent,
                'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({grant_type: 'authorization_code', code,
                redirect_uri: saved.redirectUri}).toString()
        }, 'reddit_exchange_failed', deadline)
        const token = tokenData?.access_token
        if (typeof token !== 'string' || !token || token.length > 2048 ||
            !/^(bearer)$/i.test(tokenData.token_type || '')) {
            throw apiError(502, 'reddit_exchange_failed', 'Reddit authorization failed')
        }

        const headers = {Authorization: `Bearer ${token}`, 'User-Agent': config.userAgent}
        try {
            const identity = await requestJson(fetcher, 'https://oauth.reddit.com/api/v1/me', {
                headers
            }, 'reddit_identity_failed', deadline)
            const username = parseUsername(identity)
            let profile
            try {
                profile = (await db.collection('lockcollections').doc(uid).get()).data()
            } catch {
                throw apiError(503, 'reddit_profile_unavailable', 'Reddit import is unavailable')
            }
            const bookmark = typeof profile?.redditBookmark === 'string' &&
                /^t[0-9]_[A-Za-z0-9]+$/.test(profile.redditBookmark) &&
                typeof profile?.redditUsername === 'string' &&
                profile.redditUsername.toLowerCase() === username.toLowerCase()
                ? profile.redditBookmark : null

            const flair = await requestJson(fetcher,
                'https://oauth.reddit.com/r/lockpicking/api/flairselector', {
                    method: 'POST', headers
                }, 'reddit_flair_failed', deadline)
            if (!flair?.current || typeof flair.current !== 'object') {
                throw apiError(502, 'reddit_flair_invalid', 'Reddit returned invalid flair')
            }
            const flairText = flair?.current?.flair_text
            if (flairText !== null && flairText !== undefined &&
                (typeof flairText !== 'string' || flairText.length > 256)) {
                throw apiError(502, 'reddit_flair_invalid', 'Reddit returned invalid flair')
            }

            const messages = []
            let cursor = bookmark
            let nextBookmark = bookmark
            for (let page = 0; page < maxPages; page++) {
                const previousCursor = cursor
                const url = new URL('https://oauth.reddit.com/message/inbox')
                url.searchParams.set('limit', String(pageSize))
                if (cursor) url.searchParams.set(bookmark ? 'before' : 'after', cursor)
                const response = await requestJson(fetcher, url.toString(), {headers},
                    'reddit_inbox_failed', deadline)
                const batch = parseMessages(response)
                if (batch.length) {
                    const ordered = [...batch].sort((a, b) => b.created_utc - a.created_utc)
                    cursor = bookmark ? ordered[0].name : ordered.at(-1).name
                    if (cursor === previousCursor) {
                        throw apiError(502, 'reddit_inbox_invalid', 'Reddit inbox pagination did not advance')
                    }
                    if (bookmark || !nextBookmark) nextBookmark = ordered[0].name
                    for (const message of batch) {
                        if (message.kind !== 't4' || message.distinguished !== 'moderator' ||
                            typeof message.subreddit !== 'string' ||
                            message.subreddit.toLowerCase() !== 'lockpicking') continue
                        if (typeof message.id !== 'string' || !/^[A-Za-z0-9]+$/.test(message.id) ||
                            typeof message.subject !== 'string' || typeof message.body !== 'string') {
                            throw apiError(502, 'reddit_inbox_invalid', 'Reddit returned an invalid inbox message')
                        }
                        messages.push({id: message.id, subject: message.subject,
                            body: message.body, createdUtc: message.created_utc})
                        if (Buffer.byteLength(JSON.stringify(messages)) > maxResponseBytes) {
                            throw apiError(413, 'reddit_import_too_large',
                                'Reddit inbox is too large to import in one attempt')
                        }
                    }
                }
                if (batch.length < pageSize) {
                    return {purpose: saved.purpose, username, flairText: flairText || null,
                        bookmark, nextBookmark, messages}
                }
            }
            throw apiError(413, 'reddit_import_too_large',
                'Reddit inbox is too large to import in one attempt')
        } finally {
            try {
                await fetcher('https://www.reddit.com/api/v1/revoke_token', {
                    method: 'POST',
                    headers: {Authorization: authorization, 'User-Agent': config.userAgent,
                        'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({token, token_type_hint: 'access_token'}).toString(),
                    signal: AbortSignal.timeout(requestTimeoutMs)
                })
            } catch {
                // The token is temporary; revocation failures must not expose it or hide the import result.
            }
        }
    }

    return {start, exchange}
}
