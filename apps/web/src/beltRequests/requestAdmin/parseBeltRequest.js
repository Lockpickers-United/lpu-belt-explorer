import {beltRoles} from '../../data/belts.js'

const beltStrings = beltRoles.reduce((acc, role) => {
    acc[role.toLowerCase()] = role
    const alt = role.toLowerCase()
        .replace(/(\d+)(st|nd|rd|th) dan/i, 'dan $1')
    const short = role.toLowerCase()
        .replace(/\s*belt$/, '')
    acc[alt] = role
    acc[short] = role
    return acc
}, {})

const allBeltStrings = Object.keys(beltStrings).sort((a, b) => b.length - a.length)
const alternatives = allBeltStrings
    .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')

export default function parseBeltRequest(messageContent) {

    const actionMatch = new RegExp('(?:^|\\s)(\\[me]|@LockyJr|@LPUBeltBot#5324)\\s+(\\w+)\\s*(\\w*)\\s*(.*)', 'i').exec(messageContent)
    //const _whichBot = actionMatch?.[1]
    const action = actionMatch?.[2]?.toLowerCase()
    const id = actionMatch?.[3]
    const notes = actionMatch?.[4]?.trim()

    let beltMatch = new RegExp(`\\brequest\\s+(${alternatives})(.*)`, 'is').exec(messageContent)
    let belt = beltMatch?.[1] ? beltStrings[beltMatch?.[1].toLowerCase()] : null
    let evidence = beltMatch?.[2]?.trim()

    const syncUsernameMatch = new RegExp('u\\/(\\S*)\\b', 'i').exec(messageContent)
    const syncMatch = syncUsernameMatch?.[1] ? syncUsernameMatch[1] : null

    return {
        action,
        id,
        belt,
        evidence,
        notes,
        syncMatch
    }

}