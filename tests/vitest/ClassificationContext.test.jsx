import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext, {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import allEntries from '../../src/data/data.json'
import votes from '../../src/data/classification-samples.json'
import historicalVotes from '../../src/data/classification-votes-historical.json'
import adminActions from '../../src/data/classification-samples-admin.json'
import changelogs from '../../src/data/classification-samples-changelog.json'

describe('ClassificationProvider', () => {
    it('keeps votes current for unranked entries despite a later belt date', () => {
        let classification
        function CaptureContext() {
            classification = useContext(ClassificationContext)
            return null
        }

        renderWithProviders(<ClassificationProvider><CaptureContext/></ClassificationProvider>)

        const vote = votes.find(record => record.type === 'vote' &&
            allEntries.some(entry => entry.id === record.entryId && entry.belt === 'Unranked') &&
            !adminActions.some(action => action.entryId === record.entryId))
        expect(vote).toBeDefined()
        const entry = {
            ...allEntries.find(item => item.id === vote.entryId),
            currentBeltDate: new Date(Date.parse(vote.updatedAt) + 1).toISOString()
        }
        const rankedEntry = {...entry, belt: 'Orange'}

        expect(classification.getLatestMilestone(entry).valueOf()).toBe(0)
        expect(classification.getLatestMilestone(rankedEntry).valueOf()).toBe(Date.parse(entry.currentBeltDate))
        expect(classification.getCurrentVotes(entry)).toContainEqual(vote)
        expect(classification.getPreviousVotes(entry)).not.toContainEqual(vote)
        expect(classification.getAdminActionStatus(entry)).toBe('Has Votes')
        expect(classification.getCurrentVotes(rankedEntry)).not.toContainEqual(vote)
        expect(classification.getPreviousVotes(rankedEntry)).toContainEqual(vote)
    })

    it('keeps votes and admin actions visible when an entry has no current belt date', () => {
        let classification
        function CaptureContext() {
            classification = useContext(ClassificationContext)
            return null
        }

        renderWithProviders(<ClassificationProvider><CaptureContext/></ClassificationProvider>)

        const stagedAction = adminActions.find(action => action.status === 'Staged' &&
            allEntries.some(entry => entry.id === action.entryId && entry.belt !== 'Unranked') &&
            votes.some(vote => vote.entryId === action.entryId))
        expect(stagedAction).toBeDefined()
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

        const voteWithoutAction = votes.find(record => record.type === 'vote' &&
            allEntries.some(entry => entry.id === record.entryId) &&
            !adminActions.some(action => action.entryId === record.entryId))
        expect(voteWithoutAction).toBeDefined()
        const rankedVoteEntry = {
            ...allEntries.find(entry => entry.id === voteWithoutAction.entryId),
            belt: 'Orange',
            currentBeltDate: undefined
        }
        expect(classification.getAdminActionStatus(rankedVoteEntry)).toBe('Has Votes')
        expect(classification.isActive(rankedVoteEntry)).toBe(false)
        expect(classification.isActive({...rankedVoteEntry, belt: 'Unranked'})).toBe(true)

        const reopenedAction = adminActions.find(action => action.status === 'Re-opened')
        expect(reopenedAction).toBeDefined()
        const reopenedEntry = {
            ...allEntries.find(entry => entry.id === reopenedAction.entryId),
            currentBeltDate: undefined
        }
        expect(classification.getAdminActionStatus(reopenedEntry)).toBe('Re-opened')
        expect(classification.isActive(reopenedEntry)).toBe(true)
    })

    it('uses a published changelog as the boundary between previous and current votes', () => {
        let classification
        function CaptureContext() {
            classification = useContext(ClassificationContext)
            return null
        }

        renderWithProviders(<ClassificationProvider><CaptureContext/></ClassificationProvider>)

        const publishedAction = adminActions.find(action => action.status === 'Published' &&
            changelogs.some(changelog => changelog.changes.some(change => change.adminActionId === action.id)))
        expect(publishedAction).toBeDefined()
        const changelog = changelogs.find(record => record.changes.some(change =>
            change.adminActionId === publishedAction.id))
        const entry = allEntries.find(item => item.id === publishedAction.entryId)
        const previousVote = votes.find(vote => vote.entryId === entry.id &&
            Date.parse(vote.updatedAt) < Date.parse(changelog.publishedAt))
        const currentVote = votes.find(vote => vote.entryId === entry.id &&
            Date.parse(vote.updatedAt) > Date.parse(changelog.publishedAt))

        expect(previousVote).toBeDefined()
        expect(currentVote).toBeDefined()
        expect(publishedAction.updatedAt).toBe(changelog.publishedAt)
        expect(publishedAction.lastPublishedAt).toBe(changelog.publishedAt)
        expect(changelog.changes).toContainEqual(expect.objectContaining({
            id: entry.id,
            adminActionId: publishedAction.id,
            belt: publishedAction.updatedBelt
        }))
        expect(classification.allAdminActions.every(action => action.type === 'adminAction')).toBe(true)
        expect(classification.getLatestMilestone(entry).valueOf()).toBe(Date.parse(changelog.publishedAt))
        expect(classification.getAdminAction(entry)).toEqual(publishedAction)
        expect(classification.getPreviousVotes(entry)).toContainEqual(previousVote)
        expect(classification.getPreviousVotes(entry)).not.toContainEqual(currentVote)
        expect(classification.getCurrentVotes(entry)).toContainEqual(currentVote)
        expect(classification.getCurrentVotes(entry)).not.toContainEqual(previousVote)
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
