import fs from 'fs'
import {localUser, prodUser} from '../../../keys/users.js'
import {uniqueBelts} from '../../util/belts.js'
import {setDeep, setDeepAdd, setDeepPush, setDeepUnique} from '../../util/setDeep.js'
import {jsonIt} from '../../util/jsonIt.js'
import dayjs from 'dayjs'
import snoowrap from 'snoowrap'
import {client_id, client_secret, refresh_token} from '../../../keys/reddit-keys.js'
import {flairDetails} from './data/flairs.js'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`

const requestFile = fs.readFileSync('./data/syncMessagesForFlairFix.json', 'utf8')
const requests = JSON.parse(requestFile)

const lcBelts = uniqueBelts.map(belt => belt.toLowerCase())
console.log('uniqueBelts', uniqueBelts)

const requestInfo = requests
    .sort((a, b) => {
        return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    })
    .reduce((acc, request) => {
        const {id, createdAt, tag, content} = request
        let cleanContent = content.toLowerCase()
            .replaceAll(/[.,;\[\]<>{}]/g, '')
            .replaceAll('belt', '')

        cleanContent += ' '

        let belt = cleanContent.match(/request\s+([a-zA-Z]+).+/i) ? cleanContent.match(/request\s+([a-zA-Z]+).+/i)[1] : null
        let dan = cleanContent.match(/request\s+(\d+\w+)\s+/i) ? cleanContent.match(/request\s+(\d+\w+)\s+/i)[1] : null

        belt = belt && lcBelts.includes(belt) ? belt.charAt(0).toUpperCase() + belt.slice(1) : null

        const uname = cleanContent.match(/sync u\/([\w-]+)/i)?.[1] ?? null

        if (cleanContent.includes('dan')) console.log(uname, cleanContent)

        //const rank = belt ? belt : dan
        const rank = belt
        if (!rank) return acc

        if (!acc[uname]) {
            setDeepUnique(acc,['usernames'], uname)
        }
        return acc
    }, {})

console.log('sync requests found', Object.keys(requestInfo).length)
//jsonIt('requestInfo', requestInfo)

const reddit = new snoowrap({
    userAgent: 'modmail-sync-checker by u/mgsecure',
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: refresh_token
})
await reddit.getMe()

const subredditName = 'lockpicking'
const usernames = [
    'mgsecure'
]



for (const username of usernames) {
    //console.log('Processing username:', username)
    try {
        await reapplyFlair(subredditName, username)
    } catch (err) {
        console.error(`Error processing ${username}:`, err.error || err)
    }
}



async function reapplyFlair(subredditName, username) {

    const flair = await getUserFlair(username, subredditName)

    if (flair?.user.toLowerCase() !== username.toLowerCase()) {
        console.error(`Flair user ${flair.user} does not match username ${username}`)
        return
    }

    const belt = flair?.text.split(' ')[0] || null

    if (belt) try {
        if (!flair.text.includes('Dan')) {
            console.log('Setting flair for', username, 'from', flair?.text, 'to', belt)
            await setFlair(subredditName, username, belt)
        } else {
            console.log('Skipping flair for', username, 'as it is a Dan flair:', flair.text)
        }
    } catch (err) {
        console.error('Failed to set user flair', err)
    }
}

async function setFlair(subredditName, username, belt) {
    await reddit.getMe()
    const token = reddit.accessToken

    const {id} = flairDetails[belt]

    const url = `https://oauth.reddit.com/r/${subredditName}/api/selectflair`
    const body = new URLSearchParams({
        api_type: 'json',
        name: username,
        flair_template_id: id
    })

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': reddit._config.userAgent,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    })

    const json = await res.json()
    if (!res.ok || (json.json?.errors?.length)) {
        throw new Error(`Flair API error: ${JSON.stringify(json.json?.errors || res.status)}`)
    }
    return json
}

async function getUserFlair(username, subredditName) {
    const sub = reddit.getSubreddit(subredditName)
    const list = await sub.getUserFlairList({ name: username, limit: 1 })

    const entry = list[0]
    if (!entry) return {}
    return {
        user: entry.user.name,
        text: entry.flair_text || null,
        css: entry.flair_css_class || null,
        templateId: entry.flair_template_id || null
    }
}



process.exit()
