import {describe, expect, it} from 'vitest'
import classificationVoteStats from '../../src/classification/classificationVoteStats.js'
import {getLockSortComparator} from '../../src/locks/lockSortComparators.js'

const vote = (votedBelt, updatedAt = '2026-10-04T12:00:00Z') => ({votedBelt, updatedAt})

describe('classificationVoteStats', () => {
    it('keeps empty tallies sortable', () => {
        expect(classificationVoteStats([])).toMatchObject({
            hasVotes: 'No',
            voteCount: 0,
            hasConsensus: 'No',
            latestVoteDate: null
        })

        const sort = getLockSortComparator('latestVoteDate')
        expect([
            {fuzzy: 'No votes', latestVoteDate: null},
            {fuzzy: 'Has votes', latestVoteDate: 100}
        ].sort(sort).map(entry => entry.fuzzy)).toEqual(['Has votes', 'No votes'])
    })

    it('requires at least three votes and a strict majority for consensus', () => {
        expect(classificationVoteStats([
            vote('Blue'), vote('Blue'), vote('Blue'),
            vote('Green'), vote('Green'), vote('Green')
        ]).hasConsensus).toBe('No')

        expect(classificationVoteStats([
            vote('Blue'), vote('Blue'), vote('Blue'),
            vote('Green'), vote('Green')
        ])).toMatchObject({
            hasVotes: 'Yes',
            voteCount: 5,
            hasConsensus: 'Yes',
            highestVoteBelt: 'Blue'
        })
    })
})
