import React, {useContext} from 'react'
import {createMemoryRouter, MemoryRouter, RouterProvider} from 'react-router-dom'
import {describe, expect, it} from 'vitest'
import {screen, within} from '@testing-library/react'
import {renderWithProviders, defaultTestContextValues} from '../../src/test/render.jsx'
import {FilterProvider} from '../../src/context/FilterContext.jsx'
import {classificationFilterFields} from '../../src/data/filterFields.js'
import {HistoricalVoteDataProvider} from '../../src/classification/HistoricalVoteDataProvider.jsx'
import ClassificationEntries from '../../src/classification/ClassificationEntries.jsx'
import DataContext from '../../src/context/DataContext.jsx'
import LockListContext from '../../src/locks/LockListContext.jsx'
import allEntries from '../../src/data/data.json'
import historicalVotes from '../../src/data/classification-votes-historical.json'
import modernVotes from '../../src/data/classification-samples.json'

const historicalVotesByEntry = new Map()
historicalVotes.forEach(vote => {
    const entryVotes = historicalVotesByEntry.get(vote.entryId) ?? []
    entryVotes.push(vote)
    historicalVotesByEntry.set(vote.entryId, entryVotes)
})

describe('HistoricalVoteDataProvider', () => {
    it('orders multiple archived votes by their synthetic createdAt sequence', () => {
        const entry = allEntries.find(record => historicalVotesByEntry.get(record.id)?.length > 1)
        expect(entry).toBeDefined()
        let data
        function CaptureData() {
            data = useContext(DataContext)
            return null
        }

        renderWithProviders(
            <MemoryRouter>
                <FilterProvider filterFields={classificationFilterFields}>
                    <HistoricalVoteDataProvider allEntries={[entry]}>
                        <CaptureData/>
                    </HistoricalVoteDataProvider>
                </FilterProvider>
            </MemoryRouter>
        )

        const expectedVotes = historicalVotes
            .filter(vote => vote.entryId === entry.id)
            .toSorted((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        expect(expectedVotes.length).toBeGreaterThan(1)
        expect(data.getEntryFromId(entry.id).historicalVotes).toEqual(expectedVotes)
    })

    it('shows only archived votes and keeps their details read-only', () => {
        let data
        function CaptureData() {
            data = useContext(DataContext)
            return null
        }

        const archivedVote = historicalVotes.find(vote =>
            historicalVotesByEntry.get(vote.entryId)?.length === 1 &&
            allEntries.some(entry => entry.id === vote.entryId) &&
            /^[A-Za-z0-9 ]+$/.test(vote.comment?.trim() ?? ''))
        const modernOnlyVote = modernVotes.find(vote =>
            !historicalVotesByEntry.has(vote.entryId) &&
            allEntries.some(entry => entry.id === vote.entryId))
        expect(archivedVote).toBeDefined()
        expect(modernOnlyVote).toBeDefined()
        const archivedEntry = allEntries.find(entry => entry.id === archivedVote.entryId)
        const modernOnlyEntry = allEntries.find(entry => entry.id === modernOnlyVote.entryId)

        const router = createMemoryRouter([{
            path: '/classification/past',
            handle: {route: 'classification'},
            element: (
                <FilterProvider filterFields={classificationFilterFields}>
                    <HistoricalVoteDataProvider allEntries={[archivedEntry, modernOnlyEntry]}>
                        <LockListContext.Provider value={{tab: 'search'}}>
                            <CaptureData/>
                            <ClassificationEntries historical={true}/>
                        </LockListContext.Provider>
                    </HistoricalVoteDataProvider>
                </FilterProvider>
            )
        }], {initialEntries: ['/classification/past']})

        const accessInfo = {
            ...defaultTestContextValues.access.accessInfo,
            roles: {...defaultTestContextValues.access.accessInfo.roles, classificationAdmin: true},
            features: {
                ...defaultTestContextValues.access.accessInfo.features,
                classificationVote: true,
                classificationAdmin: true,
                entryActionBar: true
            }
        }

        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: archivedVote.userId}},
            access: {accessInfo}
        })

        expect(data.visibleEntries.map(entry => entry.id)).toEqual([archivedEntry.id])
        expect(data.getEntryFromId(modernOnlyEntry.id)).toBeUndefined()
        expect(data.getEntryFromId(archivedEntry.id).voteCount).toBe(1)
        expect(data.getEntryFromId(archivedEntry.id).latestVoteDate).toBe(Date.parse(archivedVote.createdAt))
        expect(data.getEntryFromId(archivedEntry.id).historicalVotes).toEqual([archivedVote])
        expect(data.getEntryFromId(archivedEntry.id).currentVotes).toBeUndefined()

        const historicalDetails = screen.getByRole('group', {name: 'Historical votes'})
        expect(within(historicalDetails).getByText(`${archivedVote.displayName}:`)).toBeInTheDocument()
        expect(within(historicalDetails).getByText(archivedVote.comment.trim())).toBeInTheDocument()
        expect(screen.queryByRole('button', {name: /Add Your Belt Ranking Vote|Edit/})).not.toBeInTheDocument()
    })
})
