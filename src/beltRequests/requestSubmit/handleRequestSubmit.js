import {pluralize} from '../../util/stringUtils'

export default function handleRequestSubmit(form) {
    const clipboardText = form.requestPlatform.includes('Reddit')
        ? formatRedditRequest({form: form})
        : formatDiscordRequest({form: form})
    navigator.clipboard.writeText(clipboardText).then()
}

export function formatDiscordRequest(form) {
    const entries = Object.keys(form.form)
        .filter(key => key.startsWith('entry'))
        .map(key => form.form[key])
    const quests = Object.keys(form.form)
        .filter(key => key.startsWith('quest'))
        .map(key => form.form[key])

    const {requestBelt, notes, blueBeltProjectInfo, sync, danRequestEvidence} = form.form

    let syncMessage = ''
    if (sync) syncMessage = ` sync to ${sync.includes('u/') ? sync : 'u/' + sync}`
    let message = `@LPUBeltBot request ${requestBelt.replace(' Belt', '')}${syncMessage}\n\n`

    if (requestBelt.includes('Belt')) {
        entries.forEach(entry => {
            const lpuLink = `https://lpubelts.com/#/locks?tab=search&search=${entry.matchId || entry.lockId}`
            message += `**${entry.lockName}** (${entry.belt}) - **<${entry.link}>**\n`
            message += `  *${lpuLink}*\n\n`
        })

        if (quests.length) {
            quests.forEach(quest => {
                message += `Quest: **${quest.discipline}** - **${quest.tier}**\n`
                message += `${quest.details}\n\n`
            })
        }
    } else if (requestBelt.includes('Dan')) {
        message += `Dan evidence link: ${danRequestEvidence}\n\n`
    }
    if (blueBeltProjectInfo) message += `Blue Belt Project Info:\n${blueBeltProjectInfo}\n\n`
    if (notes) message += `Notes: ${notes}\n\n`

    message += 'Thank you!'

    return message
}

export function formatRedditRequest(form) {
    const entries = Object.keys(form.form)
        .filter(key => key.startsWith('entry'))
        .map(key => form.form[key])
    const quests = Object.keys(form.form)
        .filter(key => key.startsWith('quest'))
        .map(key => form.form[key])

    const {requestBelt, notes, blueBeltProjectInfo, sync, danRequestEvidence} = form.form
    const evidenceText = requestBelt.includes('Belt') ? ` using the ${pluralize('lock', entries?.length || 1)} below:` : '.'

    let message = `I'd like to request ${requestBelt}${evidenceText}\n\n`
    if (requestBelt.includes('Belt')) {
        for (const entry of entries) {
            const lpuLink = `https://lpubelts.com/#/locks?tab=search&search=${entry.matchId || entry.lockId}`

            message += `${entry.lockName} (${entry.belt}) - ${entry.link}\n`
            message += `${lpuLink}\n\n`
        }
        if (quests.length) {
            quests.forEach(quest => {
                message += `Quest: ${quest.discipline} - ${quest.tier}\n`
                message += `${quest.details}\n\n`
            })
        }

    } else if (requestBelt.includes('Dan')) {
        message += `Dan evidence link: ${danRequestEvidence}\n\n`
    }
    if (notes) message += `Notes:\n${notes}\n\n`
    if (blueBeltProjectInfo) message += `Blue Belt Project Info:\n${blueBeltProjectInfo}\n\n`
    if (sync) message += `Please sync to my Discord username: ${sync}\n\n`

    message += 'Thank you!'

    return message
}