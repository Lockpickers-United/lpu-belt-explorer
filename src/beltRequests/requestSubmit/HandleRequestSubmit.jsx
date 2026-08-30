import {pluralize} from '../../util/stringUtils'
import {enqueueSnackbar} from 'notistack'

export default function handleRequestSubmit(form) {
    console.log('HandleRequestSubmit', form)
    const clipboardText = form.requestPlatform.includes('Reddit')
        ? formatRedditRequest({form: form})
        : formatDiscordRequest({form: form})
    navigator.clipboard.writeText(clipboardText).then()
    enqueueSnackbar('Belt Request message copied to clipboard.')
}

export function formatDiscordRequest(form) {
    const entries = Object.keys(form.form)
        .filter(key => key.startsWith('entry'))
        .map(key => form.form[key])
    const {requestBelt, notes, blueBeltProjectInfo, sync, danRequestEvidence} = form.form
    let syncMessage
    if (sync) syncMessage = ` sync to ${sync.includes('u/') ? sync : 'u/' + sync}`

    let message = `@LPUBeltBot request ${requestBelt.replace(' Belt', '')}${syncMessage}\n\n`
    if (requestBelt.includes('Belt')) {
        entries.forEach(entry => {
            const lpuLink = `https://lpubelts.com/#/locks?tab=search&search=${entry.matchId || entry.lockId}`
            message += `**${entry.lockName}** (${entry.belt}) - **<${entry.link}>**\n`
            message += `  *${lpuLink}*\n\n`
        })
    } else if (requestBelt.includes('Dan')) {
        message += `Dan evidence link: ${danRequestEvidence}\n\n`
    }
    if (blueBeltProjectInfo) message += `Blue Belt Project Info:\n${blueBeltProjectInfo}\n\n`
    if (notes) message += `Notes: ${notes}\n\n`

    message += 'Thank you!'

    return message
}

export function formatRedditRequest(form) {
    console.log('formatReddit', form)

    const entries = Object.keys(form.form)
        .filter(key => key.startsWith('entry'))
        .map(key => form.form[key])
    const {requestBelt, notes, blueBeltProjectInfo, sync, danRequestEvidence} = form.form
    const evidenceText = requestBelt.includes('Belt') ? ` using the ${pluralize('lock', entries.length)} below:` : '.'

    let message = `I'd like to request ${requestBelt}${evidenceText}\n\n`
    if (requestBelt.includes('Belt')) {
        for (const entry of entries) {
            const lpuLink = `https://lpubelts.com/#/locks?tab=search&search=${entry.matchId || entry.lockId}`

            message += `${entry.lockName} (${entry.belt}) - ${entry.link}\n`
            message += `${lpuLink}\n\n`
        }
    } else if (requestBelt.includes('Dan')) {
        message += `Dan evidence link: ${danRequestEvidence}\n\n`
    }
    if (notes) message += `Notes:\n${notes}\n\n`
    if (blueBeltProjectInfo) message += `Blue Belt Project Info:\n${blueBeltProjectInfo}\n\n`
    if (sync) message += `Please sync to my Discord username: ${sync}\n\n`

    message += 'Thank you!'

    // https://lpubelts.com/#/locks?tab=search&search=109531f4

    return message
}