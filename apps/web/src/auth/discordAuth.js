const storageKey = 'discordOAuthPending'
const grantStorageKey = 'discordPostingGrant'
const grantLifetimeMs = 15 * 60 * 1000

export async function startDiscordAuth({startDiscordOAuth, purpose, returnTo = null}) {
    if (purpose === 'beltRequest') sessionStorage.removeItem(grantStorageKey)
    const nonce = crypto.randomUUID().replaceAll('-', '')
    const redirectUri = `${location.origin}/`
    const {state, authorizeUrl} = await startDiscordOAuth({purpose, returnTo, nonce, redirectUri})
    sessionStorage.setItem(storageKey, JSON.stringify({state, nonce, purpose, returnTo}))
    window.location.assign(authorizeUrl)
}

export function routeDiscordAuthCallback() {
    const url = new URL(window.location.href)
    if (!sessionStorage.getItem(storageKey) || url.hash ||
        (!url.searchParams.has('code') && !url.searchParams.has('error'))) return
    url.hash = '/auth/discord'
    window.history.replaceState(window.history.state, '', url.toString())
}

export function storeDiscordPostingGrant(postingGrant, uid) {
    sessionStorage.setItem(grantStorageKey, JSON.stringify({postingGrant, uid, savedAt: Date.now()}))
}

export function peekDiscordPostingGrant(uid) {
    let saved
    try {
        saved = JSON.parse(sessionStorage.getItem(grantStorageKey))
    } catch {
        sessionStorage.removeItem(grantStorageKey)
        return null
    }
    if (!saved) return null
    if (saved.uid !== uid || typeof saved.postingGrant !== 'string' ||
        !Number.isFinite(saved.savedAt) || saved.savedAt > Date.now() ||
        Date.now() - saved.savedAt >= grantLifetimeMs) {
        sessionStorage.removeItem(grantStorageKey)
        return null
    }
    return saved.postingGrant
}

export function takeDiscordPostingGrant(uid) {
    const postingGrant = peekDiscordPostingGrant(uid)
    sessionStorage.removeItem(grantStorageKey)
    return postingGrant
}

export function peekDiscordAuthSession() {
    try {
        return JSON.parse(sessionStorage.getItem(storageKey))
    } catch {
        return null
    }
}

export function takeDiscordAuthNonce(state) {
    const pending = peekDiscordAuthSession()
    if (!state || pending?.state !== state || !pending?.nonce) return null
    sessionStorage.removeItem(storageKey)
    return pending.nonce
}

export function clearDiscordAuthSession() {
    sessionStorage.removeItem(storageKey)
}

export function clearDiscordCallbackQuery() {
    const url = new URL(window.location.href)
    for (const key of ['discord_oauth', 'code', 'state', 'iss', 'error', 'error_description']) {
        url.searchParams.delete(key)
    }
    window.history.replaceState(window.history.state, '', url.toString())
}
