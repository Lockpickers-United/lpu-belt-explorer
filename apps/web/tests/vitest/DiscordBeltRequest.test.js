import {afterEach, describe, expect, it, vi} from 'vitest'
import {buildDiscordBeltRequest, readDiscordBeltRequestDraft,
    saveDiscordBeltRequestDraft} from '../../src/beltRequests/requestSubmit/discordBeltRequest.js'
import {peekDiscordPostingGrant, storeDiscordPostingGrant,
    takeDiscordPostingGrant} from '../../src/auth/discordAuth.js'

afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
})

describe('Discord belt request input', () => {
    it('maps selected locks and quests to the strict posting contract', () => {
        const request = buildDiscordBeltRequest({
            requestBelt: 'Purple Belt',
            entry1: {id: 'scorecard-entry', matchId: 'lock-1', lockName: 'Lock One',
                belt: 'Purple', link: 'https://example.com/evidence'},
            entry2: {lockId: 'lock-2', lockName: 'Lock Two', belt: 'Purple',
                link: 'https://example.com/other', label: 'ignored'},
            quest1: {discipline: 'Picking', tier: 'Tier 2', details: 'Completed project'},
            sync: 'u/picker', notes: 'Please review', readRequirements: true,
            requestPlatform: 'Discord Post'
        })
        expect(request).toEqual({
            requestBelt: 'Purple Belt',
            entries: [
                {matchId: 'lock-1', lockName: 'Lock One', belt: 'Purple',
                    link: 'https://example.com/evidence'},
                {lockId: 'lock-2', lockName: 'Lock Two', belt: 'Purple',
                    link: 'https://example.com/other'}
            ],
            quests: [{discipline: 'Picking', tier: 'Tier 2', details: 'Completed project'}],
            redditUsername: 'picker', notes: 'Please review'
        })
    })

    it('requires complete Dan evidence and quest details before authorization', () => {
        expect(() => buildDiscordBeltRequest({requestBelt: '1st Dan'}))
            .toThrow('Complete the required evidence')
        expect(() => buildDiscordBeltRequest({requestBelt: 'Purple Belt',
            entry1: {lockId: 'lock-1', lockName: 'Lock One', belt: 'Purple', link: 'https://example.com'},
            quest1: {discipline: 'Picking', tier: 'Tier 2'}}))
            .toThrow('Complete each quest')
    })
})

describe('OAuth session state', () => {
    it('restores a draft only for the same signed-in member', () => {
        saveDiscordBeltRequestDraft({uid: 'member-a', form: {requestBelt: 'White Belt'},
            lockCount: 1, questCount: 0})
        expect(readDiscordBeltRequestDraft('member-a')).toMatchObject({
            form: {requestBelt: 'White Belt'}, lockCount: 1, questCount: 0
        })
        expect(readDiscordBeltRequestDraft('member-b')).toBeNull()
    })

    it('binds the one-use posting grant to its Firebase member and consumes it once', () => {
        storeDiscordPostingGrant('posting-grant', 'member-a')
        expect(peekDiscordPostingGrant('member-a')).toBe('posting-grant')
        expect(takeDiscordPostingGrant('member-a')).toBe('posting-grant')
        expect(takeDiscordPostingGrant('member-a')).toBeNull()
        storeDiscordPostingGrant('other-grant', 'member-a')
        expect(peekDiscordPostingGrant('member-b')).toBeNull()
    })

    it('discards expired drafts and posting grants', () => {
        const now = Date.now()
        vi.spyOn(Date, 'now').mockReturnValue(now)
        saveDiscordBeltRequestDraft({uid: 'member-a', form: {requestBelt: 'White Belt'},
            lockCount: 1, questCount: 0})
        storeDiscordPostingGrant('posting-grant', 'member-a')
        vi.spyOn(Date, 'now').mockReturnValue(now + 15 * 60 * 1000)

        expect(peekDiscordPostingGrant('member-a')).toBeNull()
        expect(readDiscordBeltRequestDraft('member-a')).not.toBeNull()
        vi.spyOn(Date, 'now').mockReturnValue(now + 60 * 60 * 1000 + 1)
        expect(readDiscordBeltRequestDraft('member-a')).toBeNull()
    })
})
