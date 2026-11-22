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

    const messages = result.conversation?.messages ?? result?.messages ?? {}
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

    const webhook = await settings.get('installationWebhookUrl')
    const apiKey = await settings.get('webhookApiKey');

    if (!webhook) {
        throw new Error('Webhook URL not configured')
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

    const _discordPayload = {
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

    const payload = {
      source: 'Reddit',
      platform: 'Reddit',
      belt: requestedBelt,
      username: conversation?.participant?.name ?? authorName,
      currentBelt: event.messageAuthor?.flair ?? 'unknown',
      requestId: conversationId.replace(/^ModmailConversation_/, ''),
      messageContent: truncate(body) || '(empty)',
    }

    if (syncMatch) {
      payload.syncUsername = syncMatch;
      payload.syncTo = 'Discord';
    }

  console.log('Sending to webhook:', webhook);

  const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        console.error('Webhook failed:', response.status)

        try {
            await reddit.modMail.reply({
                conversationId,
                isInternal: true,
                isAuthorHidden: false,
                body: `Error sending request, request not entered. Status: ${response.status}`
            })
        } catch (error) {
            console.error('Failed to add moderator note:', error)
        }

        throw new Error(`Webhook HTTP ${response.status}`)
    }

    console.log('Belt request forwarded', {
        conversationId,
        messageId,
        requestedBelt
    })
}
