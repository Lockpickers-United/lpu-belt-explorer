import {logger} from '../../logger/logger.js'

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
    })[character])
}

export function buildEmbed({embedFields, image, link, message, username, avatar_url}) {

    const fields = Object.entries(embedFields).map(([key, value]) => ({
        name: escapeHTML(key),
        value: escapeHTML(value),
        inline: false
    }))

    return {
        username,
        avatar_url,
        title: message,
        content: message,
        embeds: [
            {
                image: {
                    url: image
                },
                description: link
            },
            {
                fields,
                color: 1127128,

            }
        ]
    }
}

export default async function sendToDiscord({embedFields, image, link, message, username, avatar}) {
    const log = logger.child({module: 'send-to-discord'})
    const env = process.env
    const isDev = env.NODE_ENV !== 'production'

    const avatars = {
        lockyJr: 'https://explore.lpubelts.com/lockyJunior/locky-junior-avatar-512.jpg',
        test: 'https://explore.lpubelts.com/lockyJunior/locky-junior-avatar-512.jpg',
        anon: 'https://lockpickersunited.org/anon-avatar.png'
    }

    const msg = typeof message === 'string' ? escapeHTML(message.trim()) : ''
    if (!msg.length) {
        log.warn('Empty message')
        return
    }

    const avatar_url = avatar && typeof avatar === 'string'
        ? avatar.trim()
        : avatars[username] || avatars.anon

    let fromName = String(username || 'Locky Jr.')
        .replace(/[\r\n\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/Discord/gi, 'Discor.d') // "discord" isn't allowed in usernames
        .replace('@', '@-')
        .slice(0, 80)
        .trim() || 'Anonymous'

    let webhookURL

    try {
        webhookURL = (isDev || username === 'test')
            ? String(env.TEST_WEBHOOK_URL).trim()
            : String(env.LPU_LOCKS_WEBHOOK_URL).trim() //LPU_WEBHOOK_URL
        new URL(webhookURL)
    } catch {
        log.error('Invalid or missing DISCORD WEBHOOK_URL')
    }

    const payload = embedFields
        ? buildEmbed({embedFields, image, link, message, username, avatar_url})
        : {
            username: fromName,
            content: msg,
            avatar_url
        }

    try {
        const r = await fetch(webhookURL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'User-Agent': 'lp-united/1.0'},
            body: JSON.stringify(payload)
        })

        const text = await r.text()
        if (!r.ok) {
            const status = [400, 401, 403, 404, 429].includes(r.status) ? r.status : 502
            log.warn({status: status, bodyLen: text.length}, 'discord webhook not OK')
        }

        log.info('discord message sent')
    } catch (err) {
        log.error({err}, 'discord webhook error')
    }
}
