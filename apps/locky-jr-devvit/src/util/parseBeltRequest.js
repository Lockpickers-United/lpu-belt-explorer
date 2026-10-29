import {beltRoles} from './belts.js'

const beltStrings = beltRoles.reduce((acc, role) => {
    const alt = role.toLowerCase()
        .replace(/(\d+)(st|nd|rd|th) dan/i, 'dan $1')
    acc[role.toLowerCase()] = role
    acc[alt] = role
    return acc
}, {})
const shortBeltStrings = beltRoles.reduce((acc, role) => {
    const alt = role.toLowerCase()
        .replace(/\s*belt$/, '')
        .replace(/(\d+)(st|nd|rd|th) dan/i, 'dan $1')
    acc[role.toLowerCase()] = role
    acc[alt] = role
    return acc
}, {})
const alternatives = Object.keys(beltStrings)
    .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
const shortAlternatives = Object.keys(shortBeltStrings)
    .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')

export function parseBeltRequest(messageContent) {

    const actionMatch = new RegExp('(?:^|\\s)(\\[me]|@LockyJr|@LPUBeltBot#5324)\\s+(\\w+)\\s*(\\w*)\\s*(.*)', 'is').exec(messageContent)
    console.log('actionMatch', actionMatch)

    //const _whichBot = actionMatch?.[1]
    const action = actionMatch?.[2].toLowerCase()
    const id = actionMatch?.[3]
    const notes = actionMatch?.[4].trim()
    const notesText = notes?.length ? `\nNotes: ${notes}` : ''

    const beltMatch = new RegExp(`\\brequest\\s+(${alternatives})\\s*(\\S*)`, 'i').exec(messageContent)
    let requestedBelt = beltMatch?.[1] ? beltStrings[beltMatch?.[1].toLowerCase()] : null
    let evidence = beltMatch?.[2] ?? null

    if (!requestedBelt) {
        const shortBeltMatch = new RegExp(`\\brequest\\s+(${shortAlternatives})\\s*(\\S*)`, 'i').exec(messageContent)
        requestedBelt = shortBeltMatch?.[1] ? shortBeltStrings[shortBeltMatch?.[1].toLowerCase()] : null
        evidence = shortBeltMatch?.[2] ?? null
    }

    const syncUsernameMatch = new RegExp('sync @(\\S*)\\b', 'i').exec(messageContent)
    const syncMatch = syncUsernameMatch?.[1] ? syncUsernameMatch[1] : null

    return {
        action,
        id,
        requestedBelt,
        evidence,
        notes,
        syncMatch
    }

}