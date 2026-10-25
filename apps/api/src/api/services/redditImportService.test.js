import {describe, expect, it, vi} from 'vitest'
import {createRedditImportService} from './redditImportService.js'

const config = {
    clientId: 'test-client', clientSecret: 'test-secret',
    redirectUri: 'https://dev.lpubelts.com/', userAgent: 'test-user-agent'
}
const nonce = 'a'.repeat(32)

function response(value, status = 200) {
    return {ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(value)}
}

function message(id, createdUtc, options = {}) {
    return {kind: 't4', data: {id, name: `t4_${id}`, created_utc: createdUtc,
        distinguished: 'moderator', subreddit: 'lockpicking', subject: 'Blue Belt',
        body: 'Blue Belt approved', ...options}}
}

function createDb(profile = {}) {
    const states = new Map()
    const ref = key => ({
        key,
        create: async data => { states.set(key, data) },
        get: async () => ({data: () => profile})
    })
    return {
        states,
        collection: name => ({doc: id => ref(`${name}/${id}`)}),
        runTransaction: async callback => {
            const deleted = []
            const result = await callback({
                get: async target => ({exists: states.has(target.key),
                    data: () => states.get(target.key)}),
                delete: target => deleted.push(target.key)
            })
            deleted.forEach(key => states.delete(key))
            return result
        }
    }
}

function setup({profile, pages = [[]], flairText = 'Blue Belt', identity = 'picker'} = {}) {
    const db = createDb(profile)
    let clock = Date.parse('2026-10-23T12:00:00Z')
    const fetcher = vi.fn(async url => {
        if (url.includes('/access_token')) return response({access_token: 'private-token', token_type: 'bearer'})
        if (url.includes('/revoke_token')) return response({})
        if (url.includes('/api/v1/me')) return response({name: identity})
        if (url.includes('/flairselector')) return response({current: {flair_text: flairText}})
        if (url.includes('/message/inbox')) return response({data: {children: pages.shift() || []}})
        throw new Error('Unexpected URL')
    })
    const service = createRedditImportService({db, fetcher, config, now: () => clock})
    const input = {uid: 'firebase-user', purpose: 'import', nonce, redirectUri: config.redirectUri}
    return {db, fetcher, service, input, advance: ms => { clock += ms }}
}

async function exchange(service, input, state) {
    return service.exchange({uid: input.uid, code: 'one-time-code', state, nonce: input.nonce})
}

describe('Reddit import service', () => {
    it('authorizes only the configured root callback and one intended purpose', async () => {
        const {service, input} = setup()
        await expect(service.start({...input, redirectUri: 'https://evil.example/'}))
            .rejects.toMatchObject({code: 'reddit_redirect_invalid'})
        await expect(service.start({...input, purpose: 'beltRequest'}))
            .rejects.toMatchObject({code: 'reddit_purpose_invalid'})
        const {state, authorizeUrl} = await service.start(input)
        const url = new URL(authorizeUrl)
        expect(url.searchParams.get('redirect_uri')).toBe(config.redirectUri)
        expect(url.searchParams.get('duration')).toBe('temporary')
        expect(url.searchParams.get('scope')).toBe('identity flair privatemessages')
        expect(url.searchParams.get('state')).toBe(state)
    })

    it('binds state to UID and nonce, expires it, and rejects replay before Reddit calls', async () => {
        const {service, input, fetcher, advance} = setup()
        const first = await service.start(input)
        await expect(exchange(service, {...input, uid: 'other'}, first.state))
            .rejects.toMatchObject({code: 'reddit_state_invalid'})
        await expect(exchange(service, {...input, nonce: 'b'.repeat(32)}, first.state))
            .rejects.toMatchObject({code: 'reddit_state_invalid'})
        expect(fetcher).not.toHaveBeenCalled()
        await exchange(service, input, first.state)
        await expect(exchange(service, input, first.state))
            .rejects.toMatchObject({code: 'reddit_state_invalid'})
        const second = await service.start(input)
        advance(10 * 60_000 + 1)
        await expect(exchange(service, input, second.state))
            .rejects.toMatchObject({code: 'reddit_state_expired'})
    })

    it('returns only verified import inputs, even with zero messages, and revokes the token', async () => {
        const {service, input, fetcher, db} = setup()
        const {state} = await service.start(input)
        const result = await exchange(service, input, state)
        expect(result).toEqual({purpose: 'import', username: 'picker', flairText: 'Blue Belt',
            bookmark: null, nextBookmark: null, messages: []})
        expect(JSON.stringify(result)).not.toContain('private-token')
        expect(fetcher.mock.calls.at(-1)[0]).toContain('/revoke_token')
        expect([...db.states.keys()].every(key => key.startsWith('redditOAuthStates/'))).toBe(true)
    })

    it('uses the bookmark only for the verified matching username and pages forward', async () => {
        const page = Array.from({length: 100}, (_, index) => message(String(index + 1), index + 1))
        const {service, input, fetcher} = setup({
            profile: {redditUsername: 'Picker', redditBookmark: 't4_old'},
            pages: [page, [message('101', 101)]]
        })
        const {state} = await service.start(input)
        const result = await exchange(service, input, state)
        expect(result.bookmark).toBe('t4_old')
        expect(result.nextBookmark).toBe('t4_101')
        expect(result.messages).toHaveLength(101)
        const inboxUrls = fetcher.mock.calls.map(call => call[0]).filter(url => url.includes('/message/inbox'))
        expect(new URL(inboxUrls[0]).searchParams.get('before')).toBe('t4_old')
        expect(new URL(inboxUrls[1]).searchParams.get('before')).toBe('t4_100')

        const changedAccount = setup({profile: {redditUsername: 'someone-else', redditBookmark: 't4_old'}})
        const changedState = await changedAccount.service.start(changedAccount.input)
        expect((await exchange(changedAccount.service, changedAccount.input, changedState.state)).bookmark)
            .toBeNull()
    })

    it('pages backward on first import and filters unrelated private messages', async () => {
        const page = Array.from({length: 100}, (_, index) => message(String(100 - index), 100 - index,
            index === 0 ? {name: 't1_100', subreddit: 'other'} : {}))
        const {service, input, fetcher} = setup({pages: [page, [message('old', 0)]]})
        const {state} = await service.start({...input, purpose: 'debugImport'})
        const result = await exchange(service, input, state)
        expect(result.purpose).toBe('debugImport')
        expect(result.nextBookmark).toBe('t1_100')
        expect(result.messages).toHaveLength(100)
        const inboxUrls = fetcher.mock.calls.map(call => call[0]).filter(url => url.includes('/message/inbox'))
        expect(new URL(inboxUrls[1]).searchParams.get('after')).toBe('t4_1')
    })

    it('fails a capped scan visibly without returning partial messages or advancing a bookmark', async () => {
        const pages = Array.from({length: 5}, (_, page) =>
            Array.from({length: 100}, (_, index) => message(String(page * 100 + index + 1),
                page * 100 + index + 1)))
        const {service, input, fetcher} = setup({pages})
        const {state} = await service.start(input)
        await expect(exchange(service, input, state)).rejects.toMatchObject({
            status: 413, code: 'reddit_import_too_large'
        })
        expect(fetcher.mock.calls.at(-1)[0]).toContain('/revoke_token')
    })

    it('rejects an oversized response and revokes without returning message bodies', async () => {
        const {service, input, fetcher} = setup({pages: [[message('large', 1,
            {body: 'private text '.repeat(23_000)})]]})
        const {state} = await service.start(input)
        const error = await exchange(service, input, state).catch(cause => cause)
        expect(error).toMatchObject({status: 413, code: 'reddit_import_too_large'})
        expect(error.message).not.toContain('private text')
        expect(fetcher.mock.calls.at(-1)[0]).toContain('/revoke_token')
    })

    it('discards the first page if the next inbox page fails', async () => {
        const page = Array.from({length: 100}, (_, index) => message(String(index + 1), index + 1))
        const {service, input, fetcher} = setup({pages: [page]})
        const original = fetcher.getMockImplementation()
        let inboxCalls = 0
        fetcher.mockImplementation((url, options) => {
            if (url.includes('/message/inbox') && ++inboxCalls === 2) return response({}, 503)
            return original(url, options)
        })
        const {state} = await service.start(input)
        await expect(exchange(service, input, state)).rejects.toMatchObject({
            status: 502, code: 'reddit_inbox_failed'
        })
        expect(fetcher.mock.calls.at(-1)[0]).toContain('/revoke_token')
    })

    it('revokes after partial Reddit failure and preserves safe error codes', async () => {
        const {service, input, fetcher} = setup()
        fetcher.mockImplementation(async url => {
            if (url.includes('/access_token')) return response({access_token: 'private-token', token_type: 'bearer'})
            if (url.includes('/revoke_token')) return response({})
            return response({}, 429)
        })
        const {state} = await service.start(input)
        await expect(exchange(service, input, state)).rejects.toMatchObject({
            status: 429, code: 'reddit_rate_limited'
        })
        expect(fetcher.mock.calls.at(-1)[0]).toContain('/revoke_token')
    })

    it('keeps a failed token exchange private and does not attempt inbox reads', async () => {
        const {service, input, fetcher} = setup()
        fetcher.mockResolvedValue(response({error: 'invalid_grant'}, 401))
        const {state} = await service.start(input)
        await expect(exchange(service, input, state)).rejects.toMatchObject({
            status: 502, code: 'reddit_exchange_failed'
        })
        expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it('reports a Reddit timeout without returning message text and still revokes', async () => {
        const {service, input, fetcher} = setup()
        fetcher.mockImplementation(async url => {
            if (url.includes('/access_token')) return response({access_token: 'private-token', token_type: 'bearer'})
            if (url.includes('/revoke_token')) return response({})
            throw new DOMException('timed out', 'TimeoutError')
        })
        const {state} = await service.start(input)
        const error = await exchange(service, input, state).catch(cause => cause)
        expect(error).toMatchObject({status: 504, code: 'reddit_timeout'})
        expect(error.message).not.toContain('private-token')
        expect(fetcher.mock.calls.at(-1)[0]).toContain('/revoke_token')
    })
})
