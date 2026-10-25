import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {fireEvent, render, screen} from '@testing-library/react'
import AppContext from '../../src/app/AppContext.jsx'
import AuthContext from '../../src/app/AuthContext.jsx'
import FilterContext from '../../src/context/FilterContext.jsx'
import useAdvancedFilterRows from '../../src/filters/useAdvancedFilterRows.js'
import {isFilterFieldVisible} from '../../src/filters/useFilterFieldVisibility.js'

function RowsProbe() {
    const {visibleFilterGroups, changeGroup, removeGroup} = useAdvancedFilterRows()
    const visible = visibleFilterGroups[0]

    return (
        <div>
            <div data-testid='visible-row'>{JSON.stringify(visible)}</div>
            <button onClick={() => changeGroup(visible._id, {values: ['Yale']})}>change</button>
            <button onClick={() => removeGroup(visible._id)}>remove</button>
        </div>
    )
}

function HiddenOnlyProbe() {
    const {visibleFilterGroups, changeGroup} = useAdvancedFilterRows()
    const visible = visibleFilterGroups[0]

    return (
        <button onClick={() => changeGroup(visible._id, {fieldName: 'makes', values: []})}>
            choose make
        </button>
    )
}

describe('useAdvancedFilterRows', () => {
    it('targets a visible row by ID when a hidden row precedes it', () => {
        const setAdvancedFilterGroups = vi.fn()
        const rows = [
            {
                _id: 'hidden-admin',
                fieldName: 'adminField',
                matchType: 'Is',
                operator: 'OR',
                values: ['private']
            },
            {
                _id: 'visible-make',
                fieldName: 'makes',
                matchType: 'Is',
                operator: 'OR',
                values: ['ABUS']
            }
        ]

        render(
            <AppContext.Provider value={{beta: false}}>
                <AuthContext.Provider value={{isLoggedIn: true}}>
                    <FilterContext.Provider value={{
                        advancedFilterGroups: () => rows,
                        setAdvancedFilterGroups,
                        createAdvancedGroupId: () => 'new-row',
                        filterFields: [
                            {fieldName: 'adminField', adminEnabled: true},
                            {fieldName: 'makes'}
                        ]
                    }}>
                        <RowsProbe/>
                    </FilterContext.Provider>
                </AuthContext.Provider>
            </AppContext.Provider>
        )

        expect(screen.getByTestId('visible-row')).toHaveTextContent('"groupIndex":1')
        fireEvent.click(screen.getByText('change'))
        expect(setAdvancedFilterGroups).toHaveBeenLastCalledWith([
            expect.objectContaining({_id: 'hidden-admin', values: ['private']}),
            expect.objectContaining({_id: 'visible-make', values: ['Yale']})
        ])

        fireEvent.click(screen.getByText('remove'))
        expect(setAdvancedFilterGroups).toHaveBeenLastCalledWith([
            expect.objectContaining({_id: 'hidden-admin'})
        ])
    })

    it('adds the fallback draft without replacing an existing hidden row', () => {
        const setAdvancedFilterGroups = vi.fn()
        const hiddenRow = {
            _id: 'hidden-admin',
            fieldName: 'adminField',
            matchType: 'Is',
            operator: 'OR',
            values: ['private']
        }

        render(
            <AppContext.Provider value={{beta: false}}>
                <AuthContext.Provider value={{isLoggedIn: true}}>
                    <FilterContext.Provider value={{
                        advancedFilterGroups: () => [hiddenRow],
                        setAdvancedFilterGroups,
                        createAdvancedGroupId: () => 'new-row',
                        filterFields: [
                            {fieldName: 'adminField', adminEnabled: true},
                            {fieldName: 'makes'}
                        ]
                    }}>
                        <HiddenOnlyProbe/>
                    </FilterContext.Provider>
                </AuthContext.Provider>
            </AppContext.Provider>
        )

        fireEvent.click(screen.getByText('choose make'))
        expect(setAdvancedFilterGroups).toHaveBeenCalledWith([
            hiddenRow,
            expect.objectContaining({
                _id: 'advanced-filter-draft',
                fieldName: 'makes',
                values: []
            })
        ])
    })

    it.each([
        [{beta: true}, {beta: false}, false],
        [{userBased: true}, {isLoggedIn: false}, false],
        [{adminEnabled: true}, {adminEnabled: false}, false],
        [{beta: true, userBased: true, adminEnabled: true}, {
            beta: true,
            isLoggedIn: true,
            adminEnabled: true
        }, true]
    ])('applies the common visibility policy to %j', (field, state, expected) => {
        expect(isFilterFieldVisible(field, state)).toBe(expected)
    })
})
