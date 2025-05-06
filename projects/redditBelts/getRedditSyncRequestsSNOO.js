import Snoowrap from 'snoowrap'
import dayjs from 'dayjs'
import fs from 'node:fs/promises'

const keys = JSON.parse(await fs.readFile('../../keys/reddit-keys.json', 'utf8'))

const {client_id, client_secret, refresh_token} = keys

const reddit = new Snoowrap({
    userAgent: 'modmail-sync-checker by u/mgsecure',
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: refresh_token
})

async function fetchArchivedSyncMessages(subName, seachTerm) {

    await reddit.getMe()                    // any valid endpoint works here
    const token = reddit.accessToken

    let before = null
    let after = '2kcw44'

//    c 2ke7h1 2025-03-30T06:34:39.886000+0000
  //  c 2kcw44 2025-03-29T13:42:28.202000+0000


    const matches = []
    let count = 0

    do {
        const url = new URL('https://oauth.reddit.com/api/mod/conversations')
        // tell it which subreddit, which state, page size, and ask for JSON
        url.searchParams.set('subreddit', subName)
        url.searchParams.set('state', 'archived')
        url.searchParams.set('limit', '100')
        url.searchParams.set('raw_json', '1')
        if (after) url.searchParams.set('after', after)

        console.log('Fetching', url.toString())

        const res = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'modmail-sync by u/mgsecure'
            }
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const response = await res.json()

        console.log('Response', response)

        const { conversations, messages } = response

        Object.keys(messages).forEach(id => {
            const msg = messages[id]
            const msgBody = msg.body.toLowerCase().replaceAll(/<.*?>/g, '').replaceAll(/\n/g, '|')

            if (!msg.author.isMod && msg.body.toLowerCase().includes(seachTerm.toLowerCase())) {

                console.log('author', msg.author.name)
                console.log('author', msg.author.isMod)
                console.log('body', msgBody)
                console.log('----------------------')

                matches.push({
                    tag: msg.author.name,
                    content: msgBody,
                    date: msg.date,
                    id: msg.id
                })

            }
        })

        const convoIds = Object.keys(conversations)
            .sort((a, b) => {
                return dayjs(conversations[b].lastUpdated).valueOf() - dayjs(conversations[a].lastUpdated).valueOf()
            })

        convoIds.forEach(id => {
            console.log('c', id, conversations[id].lastUpdated)
        })


        //before = convoIds.length === 100 ? convoIds[convoIds.length - 1] : null
        after = convoIds.length === 100 ? convoIds[convoIds.length - 1] : null

        count++
        console.log(`Fetched ${count} pages.`)

        break

    } while (matches.length < 10 && after)

    return matches
}

;(async () => {

    const searchTerm = 'discord'

    try {
        const results = await fetchArchivedSyncMessages('lockpicking', searchTerm)
        console.log(`Found ${results.length} messages containing "${searchTerm}":`)
        console.dir(results, {depth: null})
    } catch (err) {
        console.error(err)
    }
})()