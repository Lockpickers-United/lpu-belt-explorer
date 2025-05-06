import {execFile} from 'child_process'

export default async function getRedditDiscordRequestsPRAW() {

    const url = 'https://explore.lpubelts.com/data'

    const discordData = await fetch(`${url}/discordUserRoles.json`)
    if (!discordData.ok) {
        throw new Error(`HTTP error! status: ${discordData.status}`)
    }
    const discordUserRoles = await discordData.json()
    const discordUsernames = Object.keys(discordUserRoles)


    let discordRequests = []

    execFile('python3', ['projects/redditBelts/fetch_sync_requests.py'], (error, stdout, stderr) => {
        if (error) {
            console.error('Python error:', error)
            console.error('stderr:', stderr)
            return
        }
        try {
            discordRequests = JSON.parse(stdout)
            console.log(`Fetched ${discordRequests} discordRequests`)
        } catch (err) {
            console.error('Error parsing output:', err)
            console.log('Raw output:', stdout)
        }
    })

    const matches = discordRequests.reduce((acc, msg) => {
        const {msg_body} = msg

        const contentLow = msg_body.toLowerCase()
        const firstmatch = discordUsernames.find(username => contentLow.includes(username.toLowerCase()))
        const allMatches = discordUsernames.filter(username => contentLow.includes(username.toLowerCase()))
            .sort((a, b) => {
                return b.length - a.length
            })

        if (allMatches[0] && allMatches[0].length > 3) {
            acc.push({tag: msg.tag, content: msg.content, matches: allMatches})
        }
        return acc
    }, [])

    console.log('matches', matches)

}

getRedditDiscordRequestsPRAW().then()