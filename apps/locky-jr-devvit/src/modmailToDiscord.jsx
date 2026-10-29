import {Devvit} from '@devvit/public-api'
import {parseBeltRequest} from './util/parseBeltRequest.js'
import {beltDetails} from './util/belts.js'
import {testDiscordWebhookURL} from '../keys/dataUrls.js'

Devvit.configure({
    http: true,
    redditAPI: true
})

Devvit.addTrigger({
    event: 'ModMail',
    onEvent: async (event, context) => {
        console.log('event: "ModMail"', event)

        try {
            if (!context) throw new Error('Context is probably undefined')
            await sendModMailToWebhook(event, context)
        } catch (error) {
            console.error('There was an error:', error.message)
        }
    }
})

function truncate(string, maxLength = 1024) {
    if (string.length <= maxLength) {
        return string
    }
    const truncationIndicator = '... (truncated)'
    return string.substring(0, maxLength - truncationIndicator.length) + truncationIndicator
}

async function sendModMailToWebhook(event, context) {

    try {
        const webhook = testDiscordWebhookURL
        const outgoing = true
        const ignoreListRaw = ''
        const rolePing = undefined
        const onlyModDiscussions = false

        const ignoreList = ignoreListRaw
            .split(',')
            .map((u) => u.trim().toLowerCase())
            .filter(Boolean)

        const conversationId = event.conversationId ?? ''
        const actualConversationId = conversationId.replace(
            'ModmailConversation_',
            ''
        )
        const result = await context.reddit.modMail.getConversation({
            conversationId,
            markRead: false
        })

        console.log('result', result)

        const isModDiscussion = result.conversation?.isInternal ?? false
        if (onlyModDiscussions && !isModDiscussion) {
            console.log('Skipping regular modmail because only mod discussions are enabled.')
            return
        }

        const modmailLink = `https://mod.reddit.com/mail/all/${actualConversationId}`
        const messages = result.conversation?.messages ?? {}
        const messageIds = Object.keys(messages)
        const lastMessageId =
            messageIds.length > 0 ? messageIds[messageIds.length - 1] : undefined
        const lastMessage = lastMessageId || undefined
            ? messages[lastMessageId]
            : undefined

        console.log('lastMessage', lastMessage)

        if (!lastMessage) {
            console.error('No messages found')
            return
        }

        const authorName = lastMessage.author?.name ?? 'Unknown'
        const subject = result.subject ?? ''
        const body = lastMessage.bodyMarkdown?.replace(/\[(\S+)]\(\S+\)/, '$1') ?? ''
        const participatingAs = lastMessage.participatingAs ?? 'Unknown'
        const authorProfileLink = `https://www.reddit.com/u/${authorName}`
        const isPrivateNote = lastMessage.isInternal ?? false

        console.log({authorName, subject, body})

        if (!new RegExp('(?:^|\\s)@LockyJr', 'i').test(body)) {
            console.log('@LockyJr not tagged')
            return
        }

        if (ignoreList.includes(authorName.toLowerCase())) {
            console.log(`User "${authorName}" is in the ignore list. Skipping webhook.`)
            return
        }

        if (participatingAs === 'moderator' && !outgoing) {
            console.log('Not sending outgoing messages to the webhook')
            return
        }
        const messageData = parseBeltRequest(body)
        //console.log('\nparsed', messageData)

        const { action, id, requestedBelt, evidence, notes, error } = messageData

        if (error || !requestedBelt) {
            error && console.error('Error parsing message', error)
            return
        }

        const beltColor = beltDetails[requestedBelt.replace(' Belt', '')]?.color.replace('#', '')
        const color = parseInt(beltColor,16)

        //const description = `**Author:** [${authorName}](${authorProfileLink})\n**Body:** ${body}\n\n`+
        // `**Participant:** ${result.conversation?.participant?.name}\n**Participating As:** ${participatingAs}`

        const payload = {
            content: rolePing ? `<@&${rolePing}>` : undefined,
            embeds: [
                {
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
                        {name: 'username', value: result.conversation?.participant?.name, inline: true},
                        {name: 'currentBelt', value: event.messageAuthor.flair ?? 'unknown', inline: true},
                        {name: 'requestId', value: actualConversationId, inline: true},
                        {name: 'messageContent', value: truncate(body), inline: false},
                    ],
                    color: color,
                    footer: isPrivateNote ? {text: '(Private Moderator Note)'} : undefined
                }
            ]
        }

        //console.log('\npayload', JSON.stringify(payload, null, 2))

        const response = await fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            console.error(`Error sending data to webhook, status: ${response.status}`)
            try {
                const response = await context.reddit.modMail.reply({
                    conversationId: conversationId, isInternal: true, isAuthorHidden: false,
                    body: `Error sending to discord, request not entered. Status: ${response.status}`,
                })
            } catch (error) {
                console.error('Failed to add message to conversation:', error)
            }
        }
    } catch (error) {
        console.error('Error:', error.message)
    }
}

export default Devvit