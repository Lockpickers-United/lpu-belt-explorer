import fs from 'fs'
import fetch from 'node-fetch'

const credentials = {
    username: 'get from keys',
    password: 'get from keys',
    clientId: 'get from keys',
    clientSecret: 'get from keys',
    userAgent: 'flair-counter-script by u/mgsecure'
}

async function getAccessToken() {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': credentials.userAgent
        },
        body: new URLSearchParams({
            grant_type: 'password',
            username: credentials.username,
            password: credentials.password,
            scope: 'modflair read identity'
        })
    })

    const data = await response.json()
    if (!data.access_token) {
        console.error('Failed to get token:', data)
        throw new Error('Access token not received')
    }

    return data.access_token
}

async function fetchAllFlairs(accessToken) {
    const flairData = []
    const rawLines = []
    let after = null

    while (true) {
        const url = new URL('https://oauth.reddit.com/r/lockpicking/api/flair-list')
        url.searchParams.set('limit', '100')
        if (after) url.searchParams.set('after', after)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': credentials.userAgent,
                'Content-Type': 'application/json' // 🔧 required for mod APIs

            }
        })

        const result = await response.json()
        console.log('API result:', result) // 🔍 Debug

        if (!Array.isArray(result.users)) {
            console.warn('No flair users returned or not an array.')
            break
        }

        for (const user of result.users) {
            flairData.push({
                user: user.user,
                flair_text: user.flair_text,
                flair_css_class: user.flair_css_class
            })
            rawLines.push(JSON.stringify(user))
        }

        if (!result.next) break
        after = result.next
    }

    return { flairData, rawLines }
}

async function run() {
    try {
        const token = await getAccessToken()
        const { flairData, rawLines } = await fetchAllFlairs(token)

        fs.writeFileSync('redditBeltsWIP.json', JSON.stringify(flairData, null, 2), 'utf-8')
        fs.writeFileSync('belts.txt', rawLines.join('\n'), 'utf-8')

        console.log(`Wrote ${flairData.length} flair entries.`)
    } catch (err) {
        console.error('Error:', err)
    }
}

run()
