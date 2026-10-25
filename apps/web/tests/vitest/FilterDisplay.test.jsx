import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {fireEvent, render, screen} from '@testing-library/react'
import FilterContext from '../../src/context/FilterContext.jsx'
import FilterDisplay from '../../src/filters/FilterDisplay.jsx'
import FilterDisplayExclude from '../../src/filters/FilterDisplayExclude.jsx'

describe('FilterDisplay', () => {
    it('renders one parsed multi-value chip and removes the complete group', () => {
        const setAdvancedFilterGroups = vi.fn()
        const activeGroups = [{
            fieldName: 'makes',
            matchType: 'Is',
            operator: 'OR',
            values: ['ABUS', 'Master Lock']
        }]
        const draftGroup = {
            _id: 'draft-feature',
            fieldName: 'features',
            matchType: 'Is',
            operator: 'OR',
            values: []
        }
        const {container} = render(
            <FilterContext.Provider value={{
                filterCount: 1,
                filterFieldsByFieldName: {makes: {label: 'Make'}},
                activeFilterGroups: () => activeGroups,
                advancedFilterGroups: () => [...activeGroups, draftGroup],
                setAdvancedFilterGroups
            }}>
                <FilterDisplay/>
            </FilterContext.Provider>
        )

        expect(screen.getByText('ABUS OR Master Lock')).toBeTruthy()
        fireEvent.click(container.querySelector('.MuiChip-deleteIcon'))
        expect(setAdvancedFilterGroups).toHaveBeenCalledWith([draftGroup])
    })

    it('toggles exclusion for a complete parsed group and preserves drafts', () => {
        const setAdvancedFilterGroups = vi.fn()
        const activeGroup = {
            fieldName: 'makes',
            matchType: 'Is',
            operator: 'AND',
            values: ['ABUS', 'Master Lock']
        }
        const draftGroup = {
            _id: 'draft-feature',
            fieldName: 'features',
            matchType: 'Is',
            operator: 'OR',
            values: []
        }
        const {container} = render(
            <FilterContext.Provider value={{
                filterCount: 1,
                filterFieldsByFieldName: {makes: {label: 'Make'}},
                activeFilterGroups: () => [activeGroup],
                advancedFilterGroups: () => [activeGroup, draftGroup],
                setAdvancedFilterGroups
            }}>
                <FilterDisplayExclude/>
            </FilterContext.Provider>
        )

        expect(screen.getByText('ABUS AND Master Lock')).toBeTruthy()
        fireEvent.click(container.querySelector('.MuiChip-deleteIcon'))
        fireEvent.click(screen.getByRole('menuitem', {name: 'Exclude Matches'}))

        expect(setAdvancedFilterGroups).toHaveBeenCalledWith([
            {...activeGroup, matchType: 'Is Not'},
            draftGroup
        ])
    })
})
