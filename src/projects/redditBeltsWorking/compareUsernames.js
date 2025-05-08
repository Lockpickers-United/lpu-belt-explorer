import Fuse from 'fuse.js'
import fs from 'fs'

console.time('UsernameMatches')


const url = 'https://explore.lpubelts.com/data'

const redditData = await fetch(`${url}/redditUserFlairs.json`)
if (!redditData.ok) {
    throw new Error(`HTTP error! status: ${redditData.status}`)
}
const redditUserFlairs = await redditData.json()

const discordData = await fetch(`${url}/discordUserRoles.json`)
if (!discordData.ok) {
    throw new Error(`HTTP error! status: ${discordData.status}`)
}
const discordUserRoles = await discordData.json()

const redditUsernames = Object.keys(redditUserFlairs || {})
    .map(user => {
            //return `${user}|${redditUserFlairs[user]}`
            //return `${user.replaceAll(/[^a-zA-Z0-9]/g, '')}`
            return user
        }
    )
    .filter(user =>  user !== 'lockpicking' )
const discordUsernames = Object.keys(discordUserRoles || {})
    .map(user => {
            //return `${user}|${discordUserRoles[user]}`
            //return `${user.replaceAll(/[^a-zA-Z0-9]/g, '')}`
            return user
        }
    )


// match reddit usernames to sync requests
const syncMessageData = await fetch(`${url}/syncMessageData.json`)
if (!syncMessageData.ok) {
    throw new Error(`HTTP error! status: ${syncMessageData.status}`)
}
const syncMessages = await syncMessageData.json()

const preBotRequests = JSON.parse(fs.readFileSync('./preBotSyncMessageData.json', 'utf8'))



const matches = preBotRequests.reduce((acc, msg) => {
    const {id, tag, creactedAt, content} = msg

    const contentLow = content.toLowerCase()
    const firstmatch  = redditUsernames.find(username => contentLow.includes(username.toLowerCase()))
    const allMatches = redditUsernames.filter(username => contentLow.includes(username.toLowerCase()))
        .sort((a, b) => { return b.length - a.length })

    if (allMatches[0] && allMatches[0].length > 3) {
        acc.push({tag: tag, content: content.replaceAll('\n', '||'), matches: allMatches})
    }
    return acc
},[])


const SyncMatchesCsv = 'Sync Username,Best Discord Match\n'
    + matches
        .reduce((acc, request) => {
            return acc + `${request.tag}[{tk}]${request.matches[0] || ''}[{tk}]${request.content}\n`
        }, '')

console.log('SyncMatchesCsv', SyncMatchesCsv)


await fs.writeFileSync('./preBotSyncMatchesCsv.csv', SyncMatchesCsv, function (err) {
    if (err) {
        console.error('save preBotSyncMatchesCsv.csv error:', err)
    }
})


process.exit()


//////////////////////


const fuse = new Fuse(discordUsernames, {ignoreDiacritics: true, includeScore: true, threshold: 1}) // lower = stricter
const bestMatches = redditUsernames.map(query => {
    const [result] = fuse.search(query) // get only the best match
    return {
        query,
        match: result?.item || null,
        score: result?.score ?? 1
    }
}).sort((a, b) => {
    return a.score - b.score
})

console.log('bestMatches', bestMatches)

await fs.writeFileSync('./bestMatches.json', JSON.stringify(bestMatches, null, 2), function (err) {
    if (err) {
        console.error('save bestMatches.json error:', err)
    }
})

const bestMatchesCsv = 'Reddit Username,Best Discord Match,Score\n'
    + bestMatches
        .reduce((acc, match) => {
            return acc + `${match.query},${match.match},${match.score}\n`
        }, '')


await fs.writeFileSync('./bestMatches.csv', bestMatchesCsv, function (err) {
    if (err) {
        console.error('save bestMatches.csv error:', err)
    }
})


console.timeEnd('UsernameMatches')
