import {testDiscordWebhookURL} from '../keys/dataUrls.js'

const payload = {
    content: undefined,
    embeds: [
        {
            author: {
                name: 'mgsecure',
                url: 'https://www.reddit.com/user/mgsecure/'
            },
            title: 'New Belt Request',
            url: 'https://www.reddit.com/user/mgsecure/',
            fields: [
                { name: 'source', value: 'Reddit', inline: true },
                { name: 'platform', value: 'Reddit', inline: true },
                { name: 'belt', value: 'Orange Belt', inline: true },
                { name: 'username', value: 'lpubeltapp', inline: true },
                { name: 'currentBelt', value: 'unknown', inline: true },
                { name: 'requestId', value: '3u5nio', inline: true },
                { name: 'syncTo', value: 'Discord', inline: true },
                { name: 'syncUsername', value: 'mgsecure', inline: true },
                {
                    value: '@lockyjr request orange please',
                    name: 'messageContent',
                    inline: false
                }
            ],
            color: 15548997,
            footer: undefined
        }
    ]
}

console.log('\npayload', JSON.stringify(payload, null, 2))

const response = await fetch(testDiscordWebhookURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
})

    console.log('\nwebhook response', response)

