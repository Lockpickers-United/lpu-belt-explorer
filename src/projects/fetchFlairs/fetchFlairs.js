import {readFile} from 'node:fs/promises'
import {localUser, prodUser} from '../../../keys/users.js'

const production = process.env.USER === prodUser
const dataDir = production
    ? `/home/${prodUser}/discord-utils-bot-logs`
    : `/Users/${localUser}/Documents/GitHub/lpu-discord-utils-bot/data`

export default async function fetchFlairs(req,res) {

    const username = req?.query?.username
    if (!username) {
        res.json([{error: 'No user ID specified'}])
        return
    }

    let flairLog = []
    try {
        flairLog = JSON.parse(await readFile(`${dataDir}/flairLog.json`, 'utf8'))
    } catch (err) {
        console.error('Failed to open flair log:', err)
        res.json([{error: 'Failed to open flair log'}])
    }
    const userFlairs = flairLog.filter(log => log.username?.toString() === username)
    res.json(userFlairs)
}
