import {describe, expect, it, vi} from 'vitest'
import {createDiscordBeltRequestService, formatBeltRequest} from './discordBeltRequestService.js'

const identity = {discordId: '671828049540677682', username: 'mgsecure', avatarUrl: null}
const request = {
    requestBelt: 'White Belt',
    entries: [{lockId: '562e964e', lockName: 'Master Lock #3', belt: 'White',
        link: 'https://example.test/evidence'}],
    quests: []
}
const config = {target: 'test',
    testWebhookUrl: 'https://discord.com/api/webhooks/1562162476009660489/synthetic-token'}
const delivered = {id: '123456789012345678', channel_id: '1360395141822812311'}
const productionConfig = {target: 'production',
    productionWebhookUrl: 'https://discord.com/api/webhooks/123456789012345678/synthetic-token'}
const productionWebhook = {id: '123456789012345678', type: 1,
    guild_id: '140129091796992000', channel_id: '1360395141822812311'}

function setup({response = new Response(JSON.stringify(delivered), {status: 200}), target = config,
    webhook = productionWebhook} = {}) {
    const consumePostingGrant = vi.fn().mockResolvedValue(identity)
    const fetcher = vi.fn().mockImplementation((_url, options) => Promise.resolve(
        options.method === 'GET' ? new Response(JSON.stringify(webhook), {status: 200}) : response))
    const service = createDiscordBeltRequestService({consumePostingGrant, fetcher, config: target})
    return {service, consumePostingGrant, fetcher}
}

describe('Discord belt request posting', () => {
    it('formats the bot contract from verified identity and suppresses mentions', async () => {
        const {service, consumePostingGrant, fetcher} = setup()
        const result = await service.post({uid: 'firebase-user', postingGrant: 'grant', request: {
            ...request, userId: 'forged', notes: '@everyone <@123456789012345678> <@&123456789012345678>'
        }})
        expect(consumePostingGrant).toHaveBeenCalledWith({uid: 'firebase-user', postingGrant: 'grant'})
        expect(result).toEqual({messageId: delivered.id, channelId: delivered.channel_id,
            guildId: '140129091796992000',
            messageUrl: `https://discord.com/channels/140129091796992000/${delivered.channel_id}/${delivered.id}`})
        expect(fetcher).toHaveBeenCalledTimes(1)
        const [url, options] = fetcher.mock.calls[0]
        expect(url).toBe(`${config.testWebhookUrl}?wait=true`)
        const payload = JSON.parse(options.body)
        expect(payload.allowed_mentions).toEqual({parse: []})
        expect(payload.embeds[0].fields.map(field => field.name)).toEqual([
            'userId', 'userName', 'requestedBelt', 'messageContent'
        ])
        expect(payload.embeds[0].fields[0].value).toBe(identity.discordId)
        expect(payload.embeds[0].fields[3].value).toContain('https://example.test/evidence')
        expect(payload.embeds[0].fields[3].value).not.toContain('@everyone')
        expect(payload.embeds[0].fields[3].value).not.toContain('<@&123456789012345678>')
        expect(options.body).not.toContain('forged')
    })

    it('rejects invalid evidence and oversized embeds before consuming the grant', async () => {
        const {service, consumePostingGrant, fetcher} = setup()
        await expect(service.post({uid: 'firebase-user', postingGrant: 'grant', request: {
            ...request, entries: [{...request.entries[0], link: 'javascript:alert(1)'}]
        }})).rejects.toMatchObject({code: 'belt_request_invalid'})
        await expect(service.post({uid: 'firebase-user', postingGrant: 'grant', request: {
            ...request, notes: 'x'.repeat(1000)
        }})).rejects.toMatchObject({code: 'belt_request_too_long'})
        expect(consumePostingGrant).not.toHaveBeenCalled()
        expect(fetcher).not.toHaveBeenCalled()
    })

    it('fails closed for missing or mismatched webhook configuration', async () => {
        const {service, consumePostingGrant} = setup({target: {target: 'test',
            testWebhookUrl: 'https://discord.com/api/webhooks/999/synthetic-token'}})
        await expect(service.post({uid: 'firebase-user', postingGrant: 'grant', request}))
            .rejects.toMatchObject({code: 'belt_request_posting_disabled'})
        expect(consumePostingGrant).not.toHaveBeenCalled()
    })

    it('resolves the production channel and guild from the webhook URL before posting', async () => {
        const {service, consumePostingGrant, fetcher} = setup({target: productionConfig})
        const result = await service.post({uid: 'firebase-user', postingGrant: 'grant', request})
        expect(fetcher).toHaveBeenCalledTimes(2)
        expect(fetcher.mock.calls[0][0]).toBe(productionConfig.productionWebhookUrl)
        expect(fetcher.mock.calls[0][1].method).toBe('GET')
        expect(fetcher.mock.calls[1][0]).toBe(`${productionConfig.productionWebhookUrl}?wait=true`)
        expect(result).toEqual({messageId: delivered.id, channelId: productionWebhook.channel_id,
            guildId: productionWebhook.guild_id,
            messageUrl: `https://discord.com/channels/${productionWebhook.guild_id}/${productionWebhook.channel_id}/${delivered.id}`})
        expect(consumePostingGrant).toHaveBeenCalledTimes(1)
    })

    it('preserves the posting grant when production webhook metadata is invalid', async () => {
        const {service, consumePostingGrant, fetcher} = setup({target: productionConfig,
            webhook: {...productionWebhook, channel_id: null}})
        await expect(service.post({uid: 'firebase-user', postingGrant: 'grant', request}))
            .rejects.toMatchObject({code: 'belt_request_posting_disabled'})
        expect(consumePostingGrant).not.toHaveBeenCalled()
        expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it('reports rate limits and uncertain delivery without retrying', async () => {
        const rateLimited = setup({response: new Response('', {status: 429,
            headers: {'Retry-After': '7'}})})
        await expect(rateLimited.service.post({uid: 'firebase-user', postingGrant: 'grant', request}))
            .rejects.toMatchObject({status: 429, code: 'discord_rate_limited', retryAfterSeconds: 7})
        expect(rateLimited.fetcher).toHaveBeenCalledTimes(1)

        const uncertain = setup()
        uncertain.fetcher.mockRejectedValue(new Error('network timeout'))
        await expect(uncertain.service.post({uid: 'firebase-user', postingGrant: 'grant', request}))
            .rejects.toMatchObject({code: 'discord_send_uncertain'})
        expect(uncertain.fetcher).toHaveBeenCalledTimes(1)
    })

    it('does not claim delivery for a message in another channel', async () => {
        const {service} = setup({response: new Response(JSON.stringify({
            ...delivered, channel_id: '282173282546089985'
        }), {status: 200})})
        await expect(service.post({uid: 'firebase-user', postingGrant: 'grant', request}))
            .rejects.toMatchObject({code: 'discord_send_uncertain'})
    })

    it('keeps the manual Dan evidence path available in the embed', () => {
        const payload = formatBeltRequest({requestBelt: '1st Dan', entries: [], quests: [],
            danRequestEvidence: 'https://example.test/dan'}, identity)
        expect(payload.embeds[0].fields[3].value).toContain('https://example.test/dan')
    })
})
