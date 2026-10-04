import React from 'react'
import {describe, expect, it} from 'vitest'
import {screen, waitFor, within} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {renderWithRouter} from '../../src/test/render.jsx'
import DataContext from '../../src/context/DataContext.jsx'
import {FilterProvider} from '../../src/context/FilterContext.jsx'
import {classificationFilterFields} from '../../src/data/filterFields.js'
import {DataProvider} from '../../src/classification/ClassificationDataProvider.jsx'
import AdvancedFilterDrawerButton from '../../src/filters/AdvancedFilterDrawerButton.jsx'
import ClassificationEntries from '../../src/classification/ClassificationEntries.jsx'
import LockListContext from '../../src/locks/LockListContext.jsx'

const mixedVoteEntryName = /^Ikon SK6 Radienprofil Extra Code/

describe('ClassificationDataProvider', () => {
    it('updates nested vote entries when a vote filter is applied', async () => {
        const user = userEvent.setup()

        renderWithRouter(
            <DataContext.Provider value={{allEntries: []}}>
                <FilterProvider filterFields={classificationFilterFields}>
                    <DataProvider profile={{}}>
                        <LockListContext.Provider value={{tab: 'search'}}>
                            <AdvancedFilterDrawerButton/>
                            <ClassificationEntries/>
                        </LockListContext.Provider>
                    </DataProvider>
                </FilterProvider>
            </DataContext.Provider>,
            {
                route: '/classification',
                useHash: true,
                auth: {user: {uid: 'test-user'}}
            }
        )

        const entry = screen.getByRole('listitem', {name: mixedVoteEntryName})
        expect(within(entry).getByLabelText('Georgia Jim')).toBeInTheDocument()
        expect(within(entry).getByLabelText('Alpama')).toBeInTheDocument()
        expect(within(entry).getByLabelText('yabende')).toBeInTheDocument()
        expect(within(entry).getByLabelText('Sidepicks')).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'Filter'}))
        await user.click(await screen.findByRole('combobox', {name: 'Voted Belt'}))
        await user.click(await screen.findByRole('option', {name: /Brown/}))
        await user.click(screen.getByRole('button', {name: 'Close'}))

        await waitFor(() => {
            const filteredEntry = screen.getByRole('listitem', {name: mixedVoteEntryName})
            expect(within(filteredEntry).getByLabelText('Georgia Jim')).toBeInTheDocument()
            expect(within(filteredEntry).getByLabelText('Alpama')).toBeInTheDocument()
            expect(within(filteredEntry).queryByLabelText('yabende')).not.toBeInTheDocument()
            expect(within(filteredEntry).queryByLabelText('Sidepicks')).not.toBeInTheDocument()
        })
    })
})
