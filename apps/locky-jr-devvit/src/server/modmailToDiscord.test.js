import assert from 'node:assert/strict'
import {mock, test} from 'node:test'

const getSetting = mock.fn()
mock.module('@devvit/web/server', {
    exports: {settings: {get: getSetting}}
})
const {sendModMailToWebhook} = await import('./modmailToDiscord.js')

await test('only qualifying belt requests require a Discord webhook', async t => {
    const event = {
        conversationId: 'ModmailConversation_example',
        messageId: 'ModmailMessage_example'
    }
    const fetchMock = t.mock.method(globalThis, 'fetch', async () => ({ok: true}))
    const redditFor = bodyMarkdown => ({
        modMail: {
            getConversation: async () => ({
                conversation: {
                    messages: {example: {bodyMarkdown, author: {name: 'test-user'}}}
                }
            })
        }
    })

    for (const body of ['Please approve my join request', '', '@LockyJr hello']) {
        await sendModMailToWebhook(event, redditFor(body))
    }
    assert.equal(getSetting.mock.callCount(), 0)
    assert.equal(fetchMock.mock.callCount(), 0)

    await assert.rejects(
        sendModMailToWebhook(event, redditFor('@LockyJr request blue belt')),
        /Discord webhook URL not configured/
    )
    assert.equal(getSetting.mock.callCount(), 1)
    assert.equal(fetchMock.mock.callCount(), 0)

    getSetting.mock.mockImplementation(async () => 'https://discord.invalid/webhook')
    await sendModMailToWebhook(event, redditFor('Hello\n@LockyJr request blue belt'))
    assert.equal(fetchMock.mock.callCount(), 1)
    const [url, options] = fetchMock.mock.calls[0].arguments
    assert.equal(url, 'https://discord.invalid/webhook')
    assert.equal(JSON.parse(options.body).embeds[0].fields.find(field => field.name === 'belt').value, 'Blue Belt')
})
