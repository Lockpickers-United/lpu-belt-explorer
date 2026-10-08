import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {act} from '@testing-library/react'
import {renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext, {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'

describe('ClassificationProvider', () => {
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
