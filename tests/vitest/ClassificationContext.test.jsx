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
        const vote = votes.find(record => record.entryId === stagedEntry.id)

        expect(stagedEntry.currentBeltDate).toBeUndefined()
        expect(classification.getLatestMilestone(stagedEntry).valueOf()).toBe(0)
        expect(classification.getCurrentVotes(stagedEntry)).toContainEqual(vote)
        expect(classification.getAdminAction(stagedEntry)).toEqual(stagedAction)
        expect(classification.getAdminActionStatus(stagedEntry)).toBe('Staged')
        expect(classification.isActive(stagedEntry)).toBe(true)

        const laterBeltDate = {...stagedEntry, currentBeltDate: '2026-10-05T00:00:00Z'}
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
