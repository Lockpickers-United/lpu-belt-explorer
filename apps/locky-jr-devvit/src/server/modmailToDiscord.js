import {settings} from '@devvit/web/server'
import {parseBeltRequest} from '../util/parseBeltRequest.js'
import {beltDetails} from '../util/belts.js'

function truncate(string, maxLength = 1024) {
    if (string.length <= maxLength) return string

    const indicator = '... (truncated)'
    return string.substring(0, maxLength - indicator.length) + indicator
}

export async function sendModMailToWebhook(event, reddit) {
    const {
        conversationId,
        messageId
    } = event

    if (!conversationId || !messageId) {
        throw new Error('Missing ModMail conversationId or messageId')
    }

    const webhook = await settings.get('discordWebhookUrl')

    if (!webhook) {
        throw new Error('Discord webhook URL not configured')
    }

    const outgoing = true
    const ignoreListRaw = ''
    const rolePing = undefined
    const onlyModDiscussions = false

    const ignoreList = ignoreListRaw
        .split(',')
        .map(u => u.trim().toLowerCase())
        .filter(Boolean)

    const result = await reddit.modMail.getConversation({
        conversationId,
        markRead: false
    })

    const messages = result.conversation?.messages ?? result.messages ?? {}

    console.log('ModMail lookup diagnostics:', JSON.stringify({
        requestedConversationId: conversationId,
        requestedMessageId: messageId,
        resultKeys: Object.keys(result),
        returnedConversationId: result.conversation?.id,
        conversationKeys: Object.keys(result.conversation ?? {}),
        messageCount: Object.keys(messages).length,
        messages: Object.entries(messages).map(([key, value]) => ({
            key,
            id: value?.id,
            date: value?.date,
            author: value?.author?.name
        }))
    }, null, 2))

    const conversation = result.conversation
    const isModDiscussion = conversation?.isInternal ?? false

    if (onlyModDiscussions && !isModDiscussion) return

    const normalizeMessageId = id =>
        String(id ?? '').replace(/^ModmailMessage_/, '')

    const message = Object.entries(messages).find(([key, value]) =>
        normalizeMessageId(key) === normalizeMessageId(messageId) ||
        normalizeMessageId(value?.id) === normalizeMessageId(messageId)
    )?.[1]

    if (!message) {
        throw new Error(`ModMail message ${messageId} not found`)
    }

    const authorName = message.author?.name ?? 'Unknown'
    const body = message.bodyMarkdown ?? ''
    const participatingAs = message.participatingAs ?? 'Unknown'
    const isPrivateNote = message.isInternal ?? false

    if (!/(?:^|\s)@LockyJr/i.test(body)) return

    if (ignoreList.includes(authorName.toLowerCase())) return

    if (participatingAs === 'moderator' && !outgoing) return

    const messageData = parseBeltRequest(body)

    const {
        requestedBelt,
        error,
        syncMatch
    } = messageData

    if (error || !requestedBelt) {
        if (error) console.error('Error parsing message:', error)
        return
    }

    const beltColor = beltDetails[
        requestedBelt.replace(' Belt', '')
        ]?.color

    const color = beltColor
        ? parseInt(beltColor.replace('#', ''), 16)
        : 0x808080

    const authorProfileLink =
        `https://www.reddit.com/u/${encodeURIComponent(authorName)}`

    const modmailLink =
        `https://mod.reddit.com/mail/all/${conversationId.replace(/^ModmailConversation_/, '')}`

    const syncFields = syncMatch
        ? [
            {name: 'syncUsername', value: syncMatch, inline: true},
            {name: 'syncTo', value: 'Discord', inline: true},
        ]
        : []

    const payload = {
        ...(rolePing ? {content: `<@&${rolePing}>`} : {}),
        embeds: [{
            author: {
                name: authorName,
                url: authorProfileLink
            },
            title: 'New Belt Request',
            url: modmailLink,
            fields: [
                {name: 'source', value: 'Reddit', inline: true},
                {name: 'platform', value: 'Reddit', inline: true},
                {name: 'belt', value: requestedBelt, inline: true},
                {
                    name: 'username',
                    value: conversation?.participant?.name ?? authorName,
                    inline: true
                },
                {
                    name: 'currentBelt',
                    value: event.messageAuthor?.flair ?? 'unknown',
                    inline: true
                },
                {
                    name: 'requestId',
                    value: conversationId.replace(/^ModmailConversation_/, ''),
                    inline: true
                },
                ...syncFields,
                {
                    name: 'messageContent',
                    value: truncate(body) || '(empty)',
                    inline: false
                },
            ],
            color,
            ...(isPrivateNote
                ? {footer: {text: '(Private Moderator Note)'}}
                : {})
        }]
    }

    const response = await fetch(webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        console.error('Discord webhook failed:', response.status)

        try {
            await reddit.modMail.reply({
                conversationId,
                isInternal: true,
                isAuthorHidden: false,
                body: `Error sending to Discord, request not entered. Status: ${response.status}`
            })
        } catch (error) {
            console.error('Failed to add moderator note:', error)
        }

        throw new Error(`Discord webhook HTTP ${response.status}`)
    }

    console.log('Belt request forwarded to Discord', {
        conversationId,
        messageId,
        requestedBelt
    })
}
