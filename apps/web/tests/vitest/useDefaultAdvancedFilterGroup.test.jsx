import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {MemoryRouter, useLocation} from 'react-router-dom'
import FilterContext, {FilterProvider} from '../../src/context/FilterContext.jsx'
import useAdvancedFilterRows from '../../src/filters/useAdvancedFilterRows.js'
import useDefaultAdvancedFilterGroup from '../../src/filters/useDefaultAdvancedFilterGroup.js'

const filterFields = [
    {fieldName: 'make'},
    {fieldName: 'collection'}
]

function DefaultProbe() {
    useDefaultAdvancedFilterGroup({fieldName: 'collection', value: 'Any'})
    const {activeFilterGroups, clearFilters} = useContext(FilterContext)
    const {visibleFilterGroups, changeGroup} = useAdvancedFilterRows()
    const location = useLocation()

    return (
        <>
            <div data-testid='location'>{`${location.pathname}${location.search}`}</div>
            <button onClick={() => changeGroup(visibleFilterGroups[0]._id, {fieldName: 'make', values: []})}>Change field</button>
            <button onClick={clearFilters}>Clear</button>
            <div data-testid='rows'>{JSON.stringify(visibleFilterGroups)}</div>
            <div data-testid='groups'>{JSON.stringify(activeFilterGroups())}</div>
        </>
    )
}

function renderDefault(route) {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <FilterProvider filterFields={filterFields}>
                <DefaultProbe/>
            </FilterProvider>
        </MemoryRouter>
    )
}

describe('useDefaultAdvancedFilterGroup', () => {
    it('commits the default on an initially empty URL', async () => {
        renderDefault('/safelocks/collection')

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent('?collection=Any')
            expect(screen.getByTestId('groups')).toHaveTextContent('"collection"')
        })
    })

    it('preserves a field change with no values instead of restoring the default', async () => {
        renderDefault('/profile')
        await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('?collection=Any'))

        fireEvent.click(screen.getByRole('button', {name: 'Change field'}))

        await waitFor(() => {
            expect(screen.getByTestId('location').textContent).toBe('/profile')
            const rows = JSON.parse(screen.getByTestId('rows').textContent)
            expect(rows).toHaveLength(1)
            expect(rows[0]).toMatchObject({fieldName: 'make', values: []})
        })
    })

    it('allows clearing the default filter', async () => {
        renderDefault('/profile')
        await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('?collection=Any'))

        fireEvent.click(screen.getByRole('button', {name: 'Clear'}))

        await waitFor(() => {
            expect(screen.getByTestId('location').textContent).toBe('/profile')
            expect(screen.getByTestId('groups').textContent).toBe('[]')
        })
    })

    it('lets a direct filtered URL win over the default', () => {
        renderDefault('/safelocks/collection?make=AMSEC')

        expect(screen.getByTestId('location')).toHaveTextContent('?make=AMSEC')
        expect(screen.getByTestId('groups')).toHaveTextContent('"make"')
        expect(screen.getByTestId('groups')).not.toHaveTextContent('collection')
    })
})
