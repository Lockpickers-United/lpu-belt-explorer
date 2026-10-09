import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext, {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import allEntries from '../../src/data/data.json'
import votes from '../../src/data/classification-samples.json'
import historicalVotes from '../../src/data/classification-votes-historical.json'
import adminActions from '../../src/data/classification-samples-admin.json'

describe('ClassificationProvider', () => {
    it('shows sheet votes imported before an unranked entry was added', () => {
        let classification
        function CaptureContext() {
            classification = useContext(ClassificationContext)
            return null
        }

        renderWithProviders(<ClassificationProvider><CaptureContext/></ClassificationProvider>)

        const entry = allEntries.find(item => item.id === 'fdc8b16e')
        const vote = votes.find(record => record.entryId === entry.id)

        expect(Date.parse(vote.updatedAt)).toBeLessThan(Date.parse(entry.currentBeltDate))
        expect(classification.getCurrentVotes(entry)).toContainEqual(vote)
        expect(classification.getPreviousVotes(entry)).not.toContainEqual(vote)
        expect(classification.getAdminActionStatus(entry)).toBe('Has Votes')
    })

    it('keeps votes and admin actions visible when an entry has no current belt date', () => {
        let classification
        function CaptureContext() {
            classification = useContext(ClassificationContext)
            return null
        }

        renderWithProviders(<ClassificationProvider><CaptureContext/></ClassificationProvider>)

        const stagedAction = adminActions.find(action => action.status === 'Staged' &&
            allEntries.find(entry => entry.id === action.entryId)?.belt !== 'Unranked')
        const stagedEntry = allEntries.find(entry => entry.id === stagedAction.entryId)
        const entryVotes = votes.filter(record => record.entryId === stagedEntry.id)
        const entryActions = adminActions.filter(action => action.entryId === stagedEntry.id)
        const vote = entryVotes[0]
        const entryWithoutBeltDate = {...stagedEntry, currentBeltDate: undefined}

        expect(classification.getLatestMilestone(entryWithoutBeltDate).valueOf()).toBe(0)
        expect(classification.getCurrentVotes(entryWithoutBeltDate)).toContainEqual(vote)
        expect(classification.getAdminAction(entryWithoutBeltDate)).toEqual(stagedAction)
        expect(classification.getAdminActionStatus(entryWithoutBeltDate)).toBe('Staged')
        expect(classification.isActive(entryWithoutBeltDate)).toBe(true)

        const latestRecordTime = Math.max(
            ...entryVotes.map(record => Date.parse(record.updatedAt)),
            ...entryActions.map(action => Date.parse(action.updatedAt))
        )
        const laterBeltDate = {
            ...stagedEntry,
            currentBeltDate: new Date(latestRecordTime + 1).toISOString()
        }
        expect(classification.getCurrentVotes(laterBeltDate)).toEqual([])
        expect(classification.getPreviousVotes(laterBeltDate)).toContainEqual(vote)
        expect(classification.getAdminAction(laterBeltDate)).toBeNull()
        expect(classification.isActive(laterBeltDate)).toBe(false)

        const rankedVoteEntry = allEntries.find(entry => entry.id === '8d4632d9')
        expect(classification.getAdminActionStatus(rankedVoteEntry)).toBe('Has Votes')
        expect(classification.isActive(rankedVoteEntry)).toBe(false)
        expect(classification.isActive({...rankedVoteEntry, belt: 'Unranked'})).toBe(true)

        const reopenedEntry = allEntries.find(entry => entry.id === 'e2fd1519')
        expect(classification.getAdminActionStatus(reopenedEntry)).toBe('Re-opened')
        expect(classification.isActive(reopenedEntry)).toBe(true)
    })

    it('exposes only modern votes, including in previous and user vote lookups', () => {
        const contexts = []
        const historicalVote = historicalVotes.find(record => !votes.some(vote =>
            vote.entryId === record.entryId && vote.userId === record.userId))
        const entry = {id: historicalVote.entryId, currentBeltDate: undefined}
        const modernVote = votes[0]
        const modernEntry = {id: modernVote.entryId, currentBeltDate: undefined}

        function CaptureContext({index}) {
            contexts[index] = useContext(ClassificationContext)
            return null
        }

        renderWithProviders(
            <>
                <ClassificationProvider>
                    <CaptureContext index={0}/>
                </ClassificationProvider>
                <ClassificationProvider>
                    <CaptureContext index={1}/>
                </ClassificationProvider>
            </>,
            {auth: {user: {uid: modernVote.userId}}}
        )

        expect(contexts[0].allVotes).toHaveLength(votes.length)
        expect(contexts[1].allVotes).toBe(contexts[0].allVotes)
        expect(contexts[0].allVotes).not.toContainEqual(historicalVote)
        expect(contexts[0].loggedInUserVotes).toContainEqual(modernVote)
        expect(contexts[0].loggedInUserVotes.every(vote => vote.type === 'vote')).toBe(true)
        expect(contexts[0].getPreviousVotes(entry)).not.toContainEqual(historicalVote)
        expect(contexts[0].getCurrentVotes(entry)).not.toContainEqual(historicalVote)
        expect(contexts[0].getCurrentVotes(modernEntry)).toContainEqual(modernVote)
        expect(contexts[0].getUserVote(modernEntry)).toEqual(modernVote)
    })
})
