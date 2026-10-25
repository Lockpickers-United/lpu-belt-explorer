import {describe, expect, it, vi} from 'vitest'
import {createDiscordIdentityService} from './discordIdentityService.js'

const discordId = '123456789012345678'
const config = {
    clientId: 'discord-app-id',
    clientSecret: 'test-only-secret',
    redirectUris: ['https://lpubelts.com/#/auth/discord']
}

function createDb() {
    const records = new Map()
    function snapshot(key) {
        return {exists: records.has(key), data: () => records.get(key)}
    }
    return {
        records,
        collection(name) {
            return {
                doc(id) {
                    const key = `${name}/${id}`
                    return {
                        key,
                        async create(data) {
                            if (records.has(key)) throw new Error('already exists')
                            records.set(key, data)
                        },
                        async get() { return snapshot(key) },
                        async set(data) { records.set(key, data) },
                        async delete() { records.delete(key) }
                    }
                }
            }
        },
        async runTransaction(callback) {
            const deleted = []
            const result = await callback({
                get: async ref => snapshot(ref.key),
                delete: ref => deleted.push(ref.key)
            })
            deleted.forEach(key => records.delete(key))
            return result
        }
    }
}

function setup() {
    const db = createDb()
    let clock = Date.parse('2026-10-20T12:00:00Z')
    const fetcher = vi.fn()
        .mockResolvedValueOnce({ok: true, json: async () => ({access_token: 'discord-token'})})
        .mockResolvedValueOnce({ok: true, json: async () => ({
            id: discordId, username: 'picker', avatar: 'avatar_hash'
        })})
    const service = createDiscordIdentityService({db, fetcher, config, now: () => clock})
    const input = {
        uid: 'firebase-user',
        purpose: 'import',
        returnTo: null,
        nonce: 'a'.repeat(32),
        redirectUri: config.redirectUris[0]
    }
    return {db, fetcher, service, input, advance: ms => { clock += ms }}
}

describe('Discord identity service', () => {
    it('uses a browser-bound, one-time state and returns only a verified identity', async () => {
        const {db, fetcher, service, input} = setup()
        const started = await service.start(input)
        const url = new URL(started.authorizeUrl)

        expect(url.origin).toBe('https://discord.com')
        expect(url.searchParams.get('scope')).toBe('identify')
        expect(url.searchParams.get('state')).toBe(started.state)
        expect(url.searchParams.get('redirect_uri')).toBe(input.redirectUri)
        expect([...db.records.keys()].some(key => key.endsWith(started.state))).toBe(false)

        const result = await service.exchange({
            uid: input.uid, code: 'oauth-code', state: started.state, nonce: input.nonce
        })
        expect(result).toEqual({
            purpose: 'import',
            returnTo: null,
            identity: {
                discordId,
                username: 'picker',
                avatarUrl: `https://cdn.discordapp.com/avatars/${discordId}/avatar_hash.png`,
                verifiedAt: '2026-10-20T12:00:00.000Z'
            }
        })
        expect(JSON.stringify(result)).not.toContain('discord-token')
        expect([...db.records.keys()].some(key => key.startsWith('discordPostingGrants/'))).toBe(false)
        expect(fetcher).toHaveBeenCalledTimes(2)
        await expect(service.exchange({
            uid: input.uid, code: 'oauth-code', state: started.state, nonce: input.nonce
        })).rejects.toMatchObject({code: 'discord_state_invalid'})
        expect(fetcher).toHaveBeenCalledTimes(2)
    })

    it('rejects a different Firebase user or browser nonce without consuming the valid state', async () => {
        const {service, input, fetcher} = setup()
        const {state} = await service.start(input)
        await expect(service.exchange({
            uid: 'other-user', code: 'oauth-code', state, nonce: input.nonce
        })).rejects.toMatchObject({code: 'discord_state_invalid'})
        await expect(service.exchange({
            uid: input.uid, code: 'oauth-code', state, nonce: 'b'.repeat(32)
        })).rejects.toMatchObject({code: 'discord_state_invalid'})
        expect(fetcher).not.toHaveBeenCalled()
        await expect(service.exchange({
            uid: input.uid, code: 'oauth-code', state, nonce: input.nonce
        })).resolves.toMatchObject({identity: {discordId}})
    })

    it('rejects expired state before contacting Discord', async () => {
        const {service, input, advance, fetcher} = setup()
        const {state} = await service.start(input)
        advance(10 * 60_000 + 1)
        await expect(service.exchange({
            uid: input.uid, code: 'oauth-code', state, nonce: input.nonce
        })).rejects.toMatchObject({code: 'discord_state_expired'})
        expect(fetcher).not.toHaveBeenCalled()
    })

    it('does not issue a posting grant when Discord fails or returns invalid identity', async () => {
        const {db, service, input, fetcher} = setup()
        fetcher.mockReset().mockResolvedValueOnce({ok: false})
        const first = await service.start(input)
        await expect(service.exchange({
            uid: input.uid, code: 'bad-code', state: first.state, nonce: input.nonce
        })).rejects.toMatchObject({code: 'discord_exchange_failed'})

        fetcher.mockReset()
            .mockResolvedValueOnce({ok: true, json: async () => ({access_token: 'discord-token'})})
            .mockResolvedValueOnce({ok: true, json: async () => ({id: 'not-an-id', username: 'picker'})})
        const second = await service.start(input)
        await expect(service.exchange({
            uid: input.uid, code: 'code', state: second.state, nonce: input.nonce
        })).rejects.toMatchObject({code: 'discord_identity_invalid'})
        expect([...db.records.keys()].some(key => key.startsWith('discordPostingGrants/'))).toBe(false)
    })

    it('only accepts configured redirect URIs and gives each request a one-time posting grant', async () => {
        const {service, input, db} = setup()
        await expect(service.start({...input, redirectUri: 'https://evil.example/callback'}))
            .rejects.toMatchObject({code: 'discord_redirect_invalid'})
        const requestInput = {...input, purpose: 'beltRequest', returnTo: '/beltRequests'}
        const {state} = await service.start(requestInput)
        const result = await service.exchange({uid: input.uid, code: 'code', state, nonce: input.nonce})
        expect(result.postingGrant).toMatch(/^[A-Za-z0-9_-]{43}$/)
        expect([...db.records.keys()].some(key => key.endsWith(result.postingGrant))).toBe(false)
        await expect(service.consumePostingGrant({uid: 'other-user', postingGrant: result.postingGrant}))
            .rejects.toMatchObject({code: 'discord_grant_forbidden'})
        await expect(service.consumePostingGrant({uid: input.uid, postingGrant: result.postingGrant}))
            .resolves.toMatchObject({discordId})
        await expect(service.consumePostingGrant({uid: input.uid, postingGrant: result.postingGrant}))
            .rejects.toMatchObject({code: 'discord_grant_invalid'})
    })

    it('expires posting grants after fifteen minutes', async () => {
        const {service, input, advance} = setup()
        const {state} = await service.start({...input, purpose: 'beltRequest', returnTo: '/beltRequests'})
        const {postingGrant} = await service.exchange({
            uid: input.uid, code: 'code', state, nonce: input.nonce
        })
        advance(15 * 60_000 + 1)
        await expect(service.consumePostingGrant({uid: input.uid, postingGrant}))
            .rejects.toMatchObject({code: 'discord_grant_expired'})
    })
})
