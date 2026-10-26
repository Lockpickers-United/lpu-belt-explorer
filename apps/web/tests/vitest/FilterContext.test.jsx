import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {MemoryRouter, useLocation, useNavigate} from 'react-router-dom'
import FilterContext, {FilterProvider} from '../../src/context/FilterContext.jsx'

const filterFields = [
    {fieldName: 'makes'},
    {fieldName: 'lockingMechanisms'},
    {fieldName: 'features'},
    {fieldName: 'hasConsensus'}
]

function FilterProbe() {
    const {
        filterCount,
        activeFilterGroups,
        advancedFilterGroups,
        setAdvancedFilterGroups,
        addFilters,
        clearFilters
    } = useContext(FilterContext)
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div>
            <div data-testid='location'>{`${location.pathname}${location.search}`}</div>
            <div data-testid='filter-count'>{filterCount}</div>
            <div data-testid='active-groups'>{JSON.stringify(activeFilterGroups())}</div>
            <div data-testid='ui-groups'>{JSON.stringify(advancedFilterGroups())}</div>
            <button onClick={() => navigate('/locks')}>unfiltered</button>
            <button onClick={() => navigate('/locks?makes=ABUS')}>abus</button>
            <button onClick={() => setAdvancedFilterGroups([
                ...advancedFilterGroups(),
                {
                    _id: 'draft-feature',
                    fieldName: 'features',
                    matchType: 'Is',
                    operator: 'OR',
                    values: []
                }
            ])}>draft feature</button>
            <button onClick={() => setAdvancedFilterGroups(advancedFilterGroups()
                .map(group => group.fieldName === 'makes'
                    ? {...group, values: ['Master Lock']}
                    : group))}>master lock</button>
            <button onClick={() => setAdvancedFilterGroups(advancedFilterGroups()
                .map(group => group.fieldName === 'makes'
                    ? {...group, values: [...group.values, '']}
                    : group))}>add make value</button>
            <button onClick={() => navigate('/locks?lockingMechanisms=Dimple')}>dimple</button>
            <button onClick={() => navigate(-1)}>back</button>
            <button onClick={() => addFilters([
                {key: 'hasConsensus', value: false},
                {key: 'features', value: 0}
            ], true)}>false and zero</button>
            <button onClick={clearFilters}>clear</button>
        </div>
    )
}

function renderFilterProbe(initialEntries, initialIndex, additionalFilterKeys) {
    const entries = Array.isArray(initialEntries) ? initialEntries : [initialEntries]
    return render(
        <MemoryRouter initialEntries={entries} initialIndex={initialIndex}>
            <FilterProvider filterFields={filterFields} additionalFilterKeys={additionalFilterKeys}>
                <FilterProbe/>
            </FilterProvider>
        </MemoryRouter>
    )
}

describe('FilterContext', () => {
    it('uses only route-allowed keys as active filters while preserving controls', async () => {
        renderFilterProbe('/locks?tab=White&makes=ABUS&uid=123&belt=Blue&hours=48&unknown=future')

        expect(screen.getByTestId('filter-count')).toHaveTextContent('1')
        expect(screen.getByTestId('active-groups')).toHaveTextContent('"fieldName":"makes"')
        expect(screen.getByTestId('active-groups')).not.toHaveTextContent('uid')

        fireEvent.click(screen.getByText('master lock'))

        await waitFor(() => {
            const location = screen.getByTestId('location').textContent
            expect(location).toContain('makes=Master+Lock')
            expect(location).toContain('uid=123')
            expect(location).toContain('belt=Blue')
            expect(location).toContain('hours=48')
            expect(location).toContain('unknown=future')
        })
    })

    it('recognizes an explicitly declared hidden filter', () => {
        renderFilterProbe('/locks?photographers=Jane', undefined, ['photographers'])

        expect(screen.getByTestId('filter-count')).toHaveTextContent('1')
        expect(screen.getByTestId('active-groups')).toHaveTextContent('"fieldName":"photographers"')
    })

    it('preserves an incomplete draft while a local edit updates a committed group', async () => {
        renderFilterProbe('/locks?makes=ABUS')

        fireEvent.click(screen.getByText('draft feature'))
        fireEvent.click(screen.getByText('master lock'))

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent('/locks?makes=Master+Lock')
            expect(screen.getByTestId('active-groups')).toHaveTextContent('Master Lock')
            expect(screen.getByTestId('ui-groups')).toHaveTextContent('"_id":"draft-feature"')
        })
    })

    it('keeps an empty value slot in the UI without committing it', async () => {
        renderFilterProbe('/locks?makes=ABUS')

        fireEvent.click(screen.getByText('add make value'))

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent('/locks?makes=ABUS')
            expect(screen.getByTestId('active-groups')).toHaveTextContent('"values":["ABUS"]')
            expect(screen.getByTestId('ui-groups')).toHaveTextContent('"values":["ABUS",""]')
        })
    })

    it('replaces committed groups and discards drafts on external navigation', async () => {
        renderFilterProbe('/locks?makes=ABUS')

        fireEvent.click(screen.getByText('draft feature'))
        fireEvent.click(screen.getByText('dimple'))

        await waitFor(() => {
            expect(screen.getByTestId('active-groups')).toHaveTextContent('Dimple')
            expect(screen.getByTestId('ui-groups')).not.toHaveTextContent('features')
            expect(screen.getByTestId('ui-groups')).not.toHaveTextContent('ABUS')
        })
    })

    it('discards drafts and restores committed groups on browser history navigation', async () => {
        renderFilterProbe([
            '/locks?makes=ABUS',
            '/locks?lockingMechanisms=Dimple'
        ], 1)

        fireEvent.click(screen.getByText('draft feature'))
        fireEvent.click(screen.getByText('back'))

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent('/locks?makes=ABUS')
            expect(screen.getByTestId('active-groups')).toHaveTextContent('ABUS')
            expect(screen.getByTestId('ui-groups')).not.toHaveTextContent('features')
            expect(screen.getByTestId('ui-groups')).not.toHaveTextContent('Dimple')
        })
    })

    it('retains false and zero in URL writers and clears only active filters and search', async () => {
        renderFilterProbe('/locks?tab=White&search=needle&uid=123')

        fireEvent.click(screen.getByText('false and zero'))

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent('hasConsensus=false')
            expect(screen.getByTestId('location')).toHaveTextContent('features=0')
            expect(screen.getByTestId('filter-count')).toHaveTextContent('2')
        })

        fireEvent.click(screen.getByText('clear'))

        await waitFor(() => {
            const location = screen.getByTestId('location').textContent
            expect(location).toContain('tab=White')
            expect(location).toContain('uid=123')
            expect(location).not.toContain('search=')
            expect(location).not.toContain('hasConsensus=')
            expect(location).not.toContain('features=')
        })
    })

    it('clears committed filters when navigating to a URL without query params', async () => {
        renderFilterProbe('/locks?makes=ABUS')

        fireEvent.click(screen.getByText('unfiltered'))

        await waitFor(() => {
            expect(screen.getByTestId('active-groups')).toHaveTextContent('[]')
            expect(screen.getByTestId('filter-count')).toHaveTextContent('0')
        })
    })
})
