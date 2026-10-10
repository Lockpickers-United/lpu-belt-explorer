import React, {useContext} from 'react'
import {createMemoryRouter, MemoryRouter, RouterProvider} from 'react-router-dom'
import {describe, expect, it} from 'vitest'
import {screen, waitFor, within} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {renderWithProviders} from '../../src/test/render.jsx'
import {FilterProvider} from '../../src/context/FilterContext.jsx'
import {classificationFilterFields} from '../../src/data/filterFields.js'
import {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import {ClassificationDataProvider} from '../../src/classification/ClassificationDataProvider.jsx'
import AdvancedFilterDrawerButton from '../../src/filters/AdvancedFilterDrawerButton.jsx'
import ClassificationEntries from '../../src/classification/ClassificationEntries.jsx'
import LockListContext from '../../src/locks/LockListContext.jsx'
import allEntries from '../../src/data/data.json'
import modernVotes from '../../src/data/classification-samples.json'
import adminActions from '../../src/data/classification-samples-admin.json'
import DataContext from '../../src/context/DataContext.jsx'

const mixedVoteEntryName = /^Ikon SK6 Radienprofil Extra Code/
const mixedVoteEntry = allEntries.find(entry => entry.id === 'ca9828d7')

function VoteCount() {
    const {getEntryFromId} = useContext(DataContext)
    return <output data-testid='vote-count'>{getEntryFromId(mixedVoteEntry.id).voteCount}</output>
}

describe('ClassificationDataProvider', () => {
    it('keeps the active worklist and changelog scoped to active locks', () => {
        let classificationData
        function CaptureData() {
            classificationData = useContext(DataContext)
            return null
        }

        const voteOnlyRecord = modernVotes.find(vote => vote.type === 'vote' &&
            allEntries.some(entry => entry.id === vote.entryId) &&
            !adminActions.some(action => action.entryId === vote.entryId))
        const reopenedAction = adminActions.find(action => action.status === 'Re-opened' &&
            allEntries.some(entry => entry.id === action.entryId && entry.belt !== 'Unranked'))
        const rankedStagedAction = adminActions.find(action => action.status === 'Staged' &&
            allEntries.some(entry => entry.id === action.entryId && entry.belt !== 'Unranked'))
        const unrankedStagedAction = adminActions.find(action => action.status === 'Staged' &&
            allEntries.some(entry => entry.id === action.entryId && entry.belt === 'Unranked'))
        expect(voteOnlyRecord).toBeDefined()
        expect(reopenedAction).toBeDefined()
        expect(rankedStagedAction).toBeDefined()
        expect(unrankedStagedAction).toBeDefined()

        const rankedVoteEntry = {
            ...allEntries.find(entry => entry.id === voteOnlyRecord.entryId),
            belt: 'Orange',
            currentBeltDate: undefined
        }
        const rankedReopenedEntry = {
            ...allEntries.find(entry => entry.id === reopenedAction.entryId),
            currentBeltDate: undefined
        }
        const rankedStagedEntry = {
            ...allEntries.find(entry => entry.id === rankedStagedAction.entryId),
            currentBeltDate: undefined
        }
        const unrankedStagedEntry = allEntries.find(entry => entry.id === unrankedStagedAction.entryId)

        renderWithProviders(
            <MemoryRouter>
                <FilterProvider filterFields={classificationFilterFields}>
                    <ClassificationProvider>
                        <ClassificationDataProvider allEntries={[
                            rankedVoteEntry, rankedReopenedEntry, rankedStagedEntry, unrankedStagedEntry
                        ]}>
                            <CaptureData/>
                        </ClassificationDataProvider>
                    </ClassificationProvider>
                </FilterProvider>
            </MemoryRouter>,
            {auth: {user: {uid: 'test-user'}}}
        )

        expect(classificationData.getEntryFromId(rankedVoteEntry.id).classificationStatus).toBe('Has Votes')
        expect(classificationData.visibleEntries.map(entry => entry.id)).toEqual(expect.arrayContaining([
            rankedReopenedEntry.id, rankedStagedEntry.id, unrankedStagedEntry.id
        ]))
        expect(classificationData.visibleEntries.map(entry => entry.id)).not.toContain(rankedVoteEntry.id)
        expect(classificationData.visibleChangelogEntries.map(entry => entry.id)).toEqual(expect.arrayContaining([
            rankedStagedEntry.id, unrankedStagedEntry.id
        ]))
        expect(classificationData.visibleChangelogEntries).toHaveLength(2)
    })

    it('shows ranked locks with current or previous modern votes on the ranked route', () => {
        let classificationData
        function CaptureData() {
            classificationData = useContext(DataContext)
            return null
        }

        const rankedCurrentEntry = allEntries.find(entry => entry.id === '8d4632d9')
        const rankedPreviousEntry = {
            ...allEntries.find(entry => entry.id === 'e2fd1519'),
            currentBeltDate: '2099-01-01T00:00:00.000Z'
        }
        const unrankedEntry = allEntries.find(entry => entry.id === '3b7643da')
        const rankedNoVoteEntry = allEntries.find(entry => entry.belt !== 'Unranked' &&
            !modernVotes.some(vote => vote.entryId === entry.id))

        renderWithProviders(
            <MemoryRouter>
                <FilterProvider filterFields={classificationFilterFields}>
                    <ClassificationProvider>
                        <ClassificationDataProvider allEntries={[
                            rankedCurrentEntry, rankedPreviousEntry, unrankedEntry, rankedNoVoteEntry
                        ]} route='ranked'>
                            <CaptureData/>
                        </ClassificationDataProvider>
                    </ClassificationProvider>
                </FilterProvider>
            </MemoryRouter>,
            {auth: {user: {uid: 'test-user'}}}
        )

        expect(classificationData.getEntryFromId(rankedPreviousEntry.id).voteCount).toBe(0)
        expect(classificationData.getEntryFromId(rankedPreviousEntry.id).previousVotes.length).toBeGreaterThan(0)
        expect(classificationData.visibleEntries.map(entry => entry.id)).toEqual(expect.arrayContaining([
            rankedCurrentEntry.id, rankedPreviousEntry.id
        ]))
        expect(classificationData.visibleEntries).toHaveLength(2)
    })

    it('updates nested vote entries when a voter filter is applied', async () => {
        const user = userEvent.setup()

        const router = createMemoryRouter([{
            path: '/classification',
            handle: {route: 'classification'},
            element: (
                <FilterProvider filterFields={classificationFilterFields}>
                    <ClassificationProvider>
                        <ClassificationDataProvider allEntries={[mixedVoteEntry]}>
                            <LockListContext.Provider value={{tab: 'search'}}>
                                <VoteCount/>
                                <AdvancedFilterDrawerButton/>
                                <ClassificationEntries/>
                            </LockListContext.Provider>
                        </ClassificationDataProvider>
                    </ClassificationProvider>
                </FilterProvider>
            )
        }], {initialEntries: ['/classification']})

        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'test-user'}}
        })

        const entry = screen.getByRole('listitem', {name: mixedVoteEntryName})
        const fullVoteCount = screen.getByTestId('vote-count').textContent
        expect(within(entry).getByLabelText('Georgia Jim')).toBeInTheDocument()
        expect(within(entry).getByLabelText('Alpama')).toBeInTheDocument()
        expect(within(entry).getByLabelText('yabende')).toBeInTheDocument()
        expect(within(entry).getByLabelText('Sidepicks')).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'Filter'}))
        await user.click(await screen.findByRole('combobox', {name: 'Vote From'}))
        await user.click(await screen.findByRole('option', {name: /Georgia Jim/}))
        await user.click(screen.getByRole('button', {name: 'Close'}))

        await waitFor(() => {
            const filteredEntry = screen.getByRole('listitem', {name: mixedVoteEntryName})
            expect(within(filteredEntry).getByLabelText('Georgia Jim')).toBeInTheDocument()
            expect(within(filteredEntry).queryByLabelText('Alpama')).not.toBeInTheDocument()
            expect(within(filteredEntry).queryByLabelText('yabende')).not.toBeInTheDocument()
            expect(within(filteredEntry).queryByLabelText('Sidepicks')).not.toBeInTheDocument()
            expect(screen.getByTestId('vote-count')).toHaveTextContent(fullVoteCount)
        })
    })
})
