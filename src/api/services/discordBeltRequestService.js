import {beltDetails} from '../../util/belts.js'

const testTarget = {webhookId: '1562162476009660489', guildId: '140129091796992000',
    channelId: '1360395141822812311'}
const belts = new Set(['White', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Red', 'Black']
    .map(color => `${color} Belt`).concat(Array.from({length: 20}, (_, index) => {
        const number = index + 1
        const suffix = number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th'
        return `${number}${suffix} Dan`
    })))

function apiError(status, code, message, retryAfterSeconds) {
    const error = new Error(message)
    error.status = status
    error.code = code
    if (retryAfterSeconds) error.retryAfterSeconds = retryAfterSeconds
    return error
}

function httpUrl(value) {
    try {
        return ['http:', 'https:'].includes(new URL(value).protocol)
    } catch {
        return false
    }
}

function safeText(value) {
    return value.replace(/@(everyone|here)/gi, '@\u200b$1')
        .replace(/<[@#][!&]?\d+>/g, match => `<\u200b${match.slice(1)}`)
}

export function formatBeltRequest(request, identity) {
    if (!belts.has(request.requestBelt)) {
        throw apiError(400, 'belt_request_invalid', 'Invalid belt request')
    }
    const isDan = request.requestBelt.endsWith(' Dan')
    if (isDan ? !request.danRequestEvidence || request.entries.length
        : !request.entries.length || request.danRequestEvidence) {
        throw apiError(400, 'belt_request_invalid', 'Required evidence is missing or invalid')
    }
    if (request.entries.some(entry => !httpUrl(entry.link)) ||
        request.danRequestEvidence && !httpUrl(request.danRequestEvidence)) {
        throw apiError(400, 'belt_request_invalid', 'Evidence links must use HTTP or HTTPS')
    }
    if (request.requestBelt === 'Blue Belt' && !request.blueBeltProjectInfo?.trim() ||
        request.requestBelt === 'Black Belt' && !request.blackBeltMentoringInfo?.trim()) {
        throw apiError(400, 'belt_request_invalid', 'Required belt details are missing')
    }
    const lines = []
    if (isDan) {
        lines.push(`Dan evidence link: ${safeText(request.danRequestEvidence)}`)
    } else {
        for (const entry of request.entries) {
            lines.push(`**${safeText(entry.lockName)}** (${safeText(entry.belt)}) - ${safeText(entry.link)}`)
            lines.push(`https://lpubelts.com/#/locks?tab=search&search=${encodeURIComponent(entry.matchId || entry.lockId)}`)
        }
        for (const quest of request.quests) {
            lines.push(`Quest: ${safeText(quest.discipline)} - ${safeText(quest.tier)}`)
            lines.push(safeText(quest.details))
        }
    }
    if (request.blueBeltProjectInfo) lines.push(`Blue Belt Project Info: ${safeText(request.blueBeltProjectInfo)}`)
    if (request.blackBeltMentoringInfo) lines.push(`Mentoring Info: ${safeText(request.blackBeltMentoringInfo)}`)
    if (request.notes) lines.push(`Notes: ${safeText(request.notes)}`)
    const messageContent = lines.join('\n\n')
    if (!messageContent || messageContent.length > 1024) {
        throw apiError(400, 'belt_request_too_long', 'Belt request exceeds Discord embed limits')
    }
    const fields = [
        {name: 'userId', value: identity.discordId, inline: true},
        {name: 'userName', value: safeText(identity.username), inline: true},
        {name: 'requestedBelt', value: request.requestBelt, inline: true},
        {name: 'messageContent', value: messageContent, inline: false}
    ]
    if (request.redditUsername) {
        fields.push({name: 'redditUsername', value: request.redditUsername, inline: true})
    }
    if (fields.some(field => !field.value || field.value.length > 1024) ||
        fields.reduce((sum, field) => sum + field.name.length + field.value.length, 'New Belt Request'.length) > 6000) {
        throw apiError(400, 'belt_request_too_long', 'Belt request exceeds Discord embed limits')
    }
    const beltColor = beltDetails[request.requestBelt.replace(' Belt', '')]?.color.replace('#', '')
    const color = parseInt(beltColor,16)
    return {embeds: [{title: 'New Belt Request', fields, color}], allowed_mentions: {parse: []},
        username: identity.username, ...(identity.avatarUrl ? {avatar_url: identity.avatarUrl} : {})}
}

function configuredTarget(config) {
    const value = config.target === 'test' ? config.testWebhookUrl : config.productionWebhookUrl
    if (!['test', 'production'].includes(config.target)) {
        throw apiError(503, 'belt_request_posting_disabled', 'Discord posting is unavailable')
    }
    let url
    try {
        url = new URL(value)
    } catch {
        throw apiError(503, 'belt_request_posting_disabled', 'Discord posting is unavailable')
    }
    const parts = url.pathname.split('/').filter(Boolean)
    if (url.origin !== 'https://discord.com' || parts.length !== 4 ||
        parts[0] !== 'api' || parts[1] !== 'webhooks' ||
        !/^\d{1,20}$/.test(parts[2]) || !parts[3] || url.search || url.hash ||
        config.target === 'test' && parts[2] !== testTarget.webhookId) {
        throw apiError(503, 'belt_request_posting_disabled', 'Discord posting is unavailable')
    }
    return {url, webhookId: parts[2], ...(config.target === 'test' ? testTarget : {})}
}

export function createDiscordBeltRequestService({consumePostingGrant, fetcher = fetch, config}) {
    async function resolveTarget(target) {
        if (target.guildId) return target
        let response
        try {
            response = await fetcher(target.url.toString(), {method: 'GET', signal: AbortSignal.timeout(10_000)})
        } catch {
            throw apiError(503, 'belt_request_posting_disabled', 'Discord posting is unavailable')
        }
        if (!response.ok) throw apiError(503, 'belt_request_posting_disabled', 'Discord posting is unavailable')
        let webhook
        try {
            webhook = await response.json()
        } catch {
            throw apiError(503, 'belt_request_posting_disabled', 'Discord posting is unavailable')
        }
        if (webhook?.id !== target.webhookId || webhook.type !== 1 ||
            !/^\d{1,20}$/.test(webhook.guild_id || '') ||
            !/^\d{1,20}$/.test(webhook.channel_id || '')) {
            throw apiError(503, 'belt_request_posting_disabled', 'Discord posting is unavailable')
        }
        return {...target, guildId: webhook.guild_id, channelId: webhook.channel_id}
    }

    async function post({uid, postingGrant, request}) {
        formatBeltRequest(request, {discordId: '0', username: 'validation'})
        const target = await resolveTarget(configuredTarget(config))
        const identity = await consumePostingGrant({uid, postingGrant})
        const payload = formatBeltRequest(request, identity)
        target.url.searchParams.set('wait', 'true')
        let response
        try {
            response = await fetcher(target.url.toString(), {method: 'POST',
                headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload),
                signal: AbortSignal.timeout(10_000)})
        } catch {
            throw apiError(504, 'discord_send_uncertain',
                'Discord delivery could not be confirmed. Check the channel before trying again.')
        }
        if (response.status === 429) {
            const retryAfter = Number(response.headers?.get('Retry-After'))
            throw apiError(429, 'discord_rate_limited', 'Discord is rate limiting requests',
                Number.isFinite(retryAfter) && retryAfter > 0 ? Math.ceil(retryAfter) : undefined)
        }
        if (!response.ok) throw apiError(502, 'discord_send_failed', 'Discord rejected the belt request')
        let delivered
        try {
            delivered = await response.json()
        } catch {
            throw apiError(502, 'discord_send_uncertain',
                'Discord delivery could not be confirmed. Check the channel before trying again.')
        }
        if (!/^\d{1,20}$/.test(delivered?.id || '') || delivered.channel_id !== target.channelId) {
            throw apiError(502, 'discord_send_uncertain',
                'Discord delivery could not be confirmed. Check the channel before trying again.')
        }
        return {messageId: delivered.id, channelId: target.channelId, guildId: target.guildId,
            messageUrl: `https://discord.com/channels/${target.guildId}/${target.channelId}/${delivered.id}`}
    }
    return {post}
}
