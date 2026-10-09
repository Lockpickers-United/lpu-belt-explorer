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

const archivedEntry = allEntries.find(entry => entry.id === '18ecc45b')
const modernOnlyEntry = allEntries.find(entry => entry.id === '3b7643da')
const archivedVote = historicalVotes.find(vote => vote.entryId === archivedEntry.id)

describe('HistoricalVoteDataProvider', () => {
    it('orders multiple archived votes by their synthetic createdAt sequence', () => {
        const entry = allEntries.find(record => record.id === '07034c0f')
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
        expect(within(historicalDetails).getByText(/DoctorHogmaster:/)).toBeInTheDocument()
        expect(within(historicalDetails).getByText(/TEST - Doc Hog/)).toBeInTheDocument()
        expect(screen.queryByRole('button', {name: /Add Your Belt Ranking Vote|Edit/})).not.toBeInTheDocument()
    })
})
