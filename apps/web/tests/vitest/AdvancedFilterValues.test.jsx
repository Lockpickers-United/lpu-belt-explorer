import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import DataContext from '../../src/context/DataContext.jsx'
import FilterContext, {FilterProvider} from '../../src/context/FilterContext.jsx'
import AdvancedFilterValues from '../../src/filters/AdvancedFilterValues.jsx'

const filterFields = [{fieldName: 'makes', label: 'Make'}]

function AddValueProbe() {
    const {
        activeFilterGroups,
        advancedFilterGroups,
        setAdvancedFilterGroups
    } = useContext(FilterContext)
    const groups = advancedFilterGroups()
    const group = {...groups[0], groupIndex: 0}

    const handleChange = updated => {
        setAdvancedFilterGroups(groups.map(row => (
            row._id === group._id ? {...row, ...updated} : row
        )))
    }

    return (
        <>
            <AdvancedFilterValues group={group} onChange={handleChange}/>
            <div data-testid='active-groups'>{JSON.stringify(activeFilterGroups())}</div>
            <div data-testid='ui-groups'>{JSON.stringify(advancedFilterGroups())}</div>
        </>
    )
}

describe('AdvancedFilterValues', () => {
    it('shows a new value control without committing the empty slot', async () => {
        const entries = [
            {id: '1', makes: ['ABUS']},
            {id: '2', makes: ['Master Lock']}
        ]
        render(
            <MemoryRouter initialEntries={['/locks?makes=ABUS']}>
                <FilterProvider filterFields={filterFields}>
                    <DataContext.Provider value={{
                        searchedEntries: entries,
                        visibleEntries: entries
                    }}>
                        <AddValueProbe/>
                    </DataContext.Provider>
                </FilterProvider>
            </MemoryRouter>
        )

        expect(screen.getAllByRole('combobox')).toHaveLength(1)
        fireEvent.click(screen.getByRole('button', {name: 'add filter group'}))

        await waitFor(() => {
            expect(screen.getAllByRole('combobox')).toHaveLength(2)
            expect(screen.getByTestId('ui-groups')).toHaveTextContent('"values":["ABUS",""]')
        })
        expect(screen.getByTestId('active-groups')).toHaveTextContent('"values":["ABUS"]')
    })
})
