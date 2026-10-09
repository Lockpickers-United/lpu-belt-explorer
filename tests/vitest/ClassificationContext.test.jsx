import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {act} from '@testing-library/react'
import {renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext, {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import allEntries from '../../src/data/data.json'
import votes from '../../src/data/classification-samples.json'
import adminActions from '../../src/data/classification-samples-admin.json'

describe('ClassificationProvider', () => {
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
    })

    it('shares historical votes across provider instances after the first load', async () => {
        const contexts = []

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
            </>
        )

        const currentVotes = contexts[0].allVotes
        expect(contexts[0].historicalVotesLoaded).toBe(false)
        expect(contexts[1].historicalVotesLoaded).toBe(false)

        let historicalVotes
        await act(async () => {
            const firstLoad = contexts[0].loadHistoricalVotes()
            expect(contexts[1].loadHistoricalVotes()).toBe(firstLoad)
            historicalVotes = await firstLoad
        })

        expect(Array.isArray(historicalVotes)).toBe(true)
        expect(historicalVotes.length).toBeGreaterThan(0)
        expect(contexts[0].historicalVotesLoaded).toBe(true)
        expect(contexts[1].historicalVotesLoaded).toBe(true)
        expect(contexts[1].getHistoricalVotes(historicalVotes[0].entryId)).toContainEqual(historicalVotes[0])
        expect(contexts[1].getHistoricalVotes('missing-entry')).toEqual([])
        expect(await contexts[0].loadHistoricalVotes()).toBe(historicalVotes)
        expect(contexts[0].allVotes).toBe(currentVotes)
    })
})
