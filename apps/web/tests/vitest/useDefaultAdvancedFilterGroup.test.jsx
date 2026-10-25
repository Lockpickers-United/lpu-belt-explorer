import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import {MemoryRouter, useLocation} from 'react-router-dom'
import FilterContext, {FilterProvider} from '../../src/context/FilterContext.jsx'
import useDefaultAdvancedFilterGroup from '../../src/filters/useDefaultAdvancedFilterGroup.js'

const filterFields = [
    {fieldName: 'make'},
    {fieldName: 'collection'}
]

function DefaultProbe() {
    useDefaultAdvancedFilterGroup({fieldName: 'collection', value: 'Any'})
    const {activeFilterGroups} = useContext(FilterContext)
    const location = useLocation()

    return (
        <>
            <div data-testid='location'>{`${location.pathname}${location.search}`}</div>
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

    it('lets a direct filtered URL win over the default', () => {
        renderDefault('/safelocks/collection?make=AMSEC')

        expect(screen.getByTestId('location')).toHaveTextContent('?make=AMSEC')
        expect(screen.getByTestId('groups')).toHaveTextContent('"make"')
        expect(screen.getByTestId('groups')).not.toHaveTextContent('collection')
    })
})
