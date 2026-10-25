import {createHash, randomBytes} from 'node:crypto'
import {Timestamp} from 'firebase-admin/firestore'

const stateCollection = 'discordOAuthStates'
const grantCollection = 'discordPostingGrants'
const stateLifetimeMs = 10 * 60_000
const grantLifetimeMs = 15 * 60_000

function apiError(status, code, message) {
    const error = new Error(message)
    error.status = status
    error.code = code
    return error
}

function hash(value) {
    return createHash('sha256').update(value).digest('hex')
}

function requireDiscordConfig(config) {
    if (!config.clientId || !config.clientSecret || config.redirectUris.length === 0) {
        throw apiError(503, 'discord_not_configured', 'Discord linking is unavailable')
    }
}

function parseDiscordIdentity(data) {
    if (!/^\d{1,20}$/.test(data?.id || '') ||
        typeof data?.username !== 'string' || !data.username.trim() || data.username.length > 32) {
        throw apiError(502, 'discord_identity_invalid', 'Discord returned an invalid identity')
    }
    const avatar = typeof data.avatar === 'string' && /^[a-zA-Z0-9_]{1,128}$/.test(data.avatar)
        ? data.avatar
        : null
    return {
        discordId: data.id,
        username: data.username,
        avatarUrl: avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${avatar}.png` : null
    }
}

export function createDiscordIdentityService({db, fetcher = fetch, now = () => Date.now(), config}) {
    function stateRef(state) {
        return db.collection(stateCollection).doc(hash(state))
    }

    function grantRef(grant) {
        return db.collection(grantCollection).doc(hash(grant))
    }

    async function start({uid, purpose, returnTo, nonce, redirectUri}) {
        requireDiscordConfig(config)
        if (!config.redirectUris.includes(redirectUri)) {
            throw apiError(400, 'discord_redirect_invalid', 'Invalid Discord redirect URI')
        }

        const state = randomBytes(32).toString('base64url')
        await stateRef(state).create({
            uid,
            purpose,
            returnTo,
            nonceHash: hash(nonce),
            redirectUri,
            expiresAt: Timestamp.fromMillis(now() + stateLifetimeMs)
        })

        const authorizeUrl = new URL('https://discord.com/oauth2/authorize')
        authorizeUrl.searchParams.set('client_id', config.clientId)
        authorizeUrl.searchParams.set('response_type', 'code')
        authorizeUrl.searchParams.set('redirect_uri', redirectUri)
        authorizeUrl.searchParams.set('scope', 'identify')
        authorizeUrl.searchParams.set('state', state)
        return {state, authorizeUrl: authorizeUrl.toString()}
    }

    async function exchange({uid, code, state, nonce}) {
        requireDiscordConfig(config)
        const saved = await db.runTransaction(async transaction => {
            const ref = stateRef(state)
            const snapshot = await transaction.get(ref)
            if (!snapshot.exists) {
                throw apiError(400, 'discord_state_invalid', 'Discord authorization has expired or was already used')
            }
            const data = snapshot.data()
            if (!data.expiresAt || data.expiresAt.toMillis() <= now()) {
                throw apiError(400, 'discord_state_expired', 'Discord authorization has expired')
            }
            if (data.uid !== uid || data.nonceHash !== hash(nonce)) {
                throw apiError(400, 'discord_state_invalid', 'Discord authorization does not match this session')
            }
            transaction.delete(ref)
            return data
        })

        let tokenResponse
        try {
            tokenResponse = await fetcher('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: saved.redirectUri
                })
            })
        } catch {
            throw apiError(502, 'discord_exchange_failed', 'Discord authorization is unavailable')
        }
        if (!tokenResponse.ok) {
            throw apiError(502, 'discord_exchange_failed', 'Discord authorization failed')
        }

        let token
        try {
            token = (await tokenResponse.json()).access_token
        } catch {
            throw apiError(502, 'discord_exchange_failed', 'Discord authorization failed')
        }
        if (typeof token !== 'string' || !token) {
            throw apiError(502, 'discord_exchange_failed', 'Discord authorization failed')
        }

        let identityResponse
        try {
            identityResponse = await fetcher('https://discord.com/api/users/@me', {
                headers: {Authorization: `Bearer ${token}`}
            })
        } catch {
            throw apiError(502, 'discord_identity_failed', 'Discord identity lookup is unavailable')
        }
        if (!identityResponse.ok) {
            throw apiError(502, 'discord_identity_failed', 'Discord identity lookup failed')
        }

        let identity
        try {
            identity = parseDiscordIdentity(await identityResponse.json())
        } catch (error) {
            if (error.code) throw error
            throw apiError(502, 'discord_identity_invalid', 'Discord returned an invalid identity')
        }
        const verifiedAt = new Date(now()).toISOString()
        const verifiedIdentity = {...identity, verifiedAt}
        if (saved.purpose === 'beltRequest') {
            const postingGrant = randomBytes(32).toString('base64url')
            await grantRef(postingGrant).create({
                uid,
                identity: verifiedIdentity,
                expiresAt: Timestamp.fromMillis(now() + grantLifetimeMs)
            })
            return {purpose: saved.purpose, returnTo: saved.returnTo, identity: verifiedIdentity,
                postingGrant}
        }
        return {purpose: saved.purpose, returnTo: saved.returnTo, identity: verifiedIdentity}
    }

    async function consumePostingGrant({uid, postingGrant}) {
        return db.runTransaction(async transaction => {
            const ref = grantRef(postingGrant)
            const snapshot = await transaction.get(ref)
            if (!snapshot.exists) {
                throw apiError(400, 'discord_grant_invalid', 'Discord authorization is missing or already used')
            }
            const data = snapshot.data()
            if (!data.expiresAt || data.expiresAt.toMillis() <= now()) {
                throw apiError(400, 'discord_grant_expired', 'Discord authorization has expired')
            }
            if (data.uid !== uid) {
                throw apiError(403, 'discord_grant_forbidden', 'Discord authorization belongs to another user')
            }
            transaction.delete(ref)
            return data.identity
        })
    }

    return {start, exchange, consumePostingGrant}
}
