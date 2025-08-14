import Snoowrap from 'snoowrap'
import fs from 'node:fs/promises'

const {client_id, client_secret, refresh_token} = JSON.parse(
    await fs.readFile('../../../keys/reddit-keys.json', 'utf8')
)

const reddit = new Snoowrap({
    userAgent: 'modmail-sync-checker by u/mgsecure',
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: refresh_token
})

async function checkScopes() {
    // refresh token if needed
    await reddit.getMe()
    const token = reddit.accessToken

    const res = await fetch('https://oauth.reddit.com/api/v1/scopes', {
        headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'modmail-sync-checker by u/mgsecure'
        }
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch scopes: HTTP ${res.status}`)
    }

    const scopes = await res.json()
    console.log('Granted scopes:', Object.keys(scopes).filter(s => scopes[s].enabled))
}

;(async () => {
    try {
        await checkScopes()
    } catch (err) {
        console.error(err)
    }
})()
