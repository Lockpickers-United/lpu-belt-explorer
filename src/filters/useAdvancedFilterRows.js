import {useCallback, useContext, useMemo} from 'react'
import FilterContext from '../context/FilterContext.jsx'
import {
    changeAdvancedFilterRow,
    removeAdvancedFilterRow
} from '../context/advancedFilterState.js'
import useFilterFieldVisibility from './useFilterFieldVisibility.js'

export default function useAdvancedFilterRows() {
    const {
        advancedFilterGroups,
        setAdvancedFilterGroups,
        createAdvancedGroupId,
        filterFields
    } = useContext(FilterContext)
    const isFilterFieldVisible = useFilterFieldVisibility()

    const blankFilterGroup = useMemo(() => ({
        _id: 'advanced-filter-draft',
        fieldName: '',
        matchType: 'Is',
        operator: 'OR',
        values: []
    }), [])

    const visibleFilterGroups = useMemo(() => {
        const groups = advancedFilterGroups()
        const visibleGroups = groups
            .map((group, groupIndex) => ({...group, groupIndex}))
            .filter(group => {
                const filterField = filterFields.find(field => field.fieldName === group.fieldName)
                return isFilterFieldVisible(filterField)
            })
        return visibleGroups.length > 0
            ? visibleGroups
            : [{...blankFilterGroup, groupIndex: 0}]
    }, [advancedFilterGroups, blankFilterGroup, filterFields, isFilterFieldVisible])

    const addFilter = useCallback(() => {
        setAdvancedFilterGroups([...advancedFilterGroups(), {
            ...blankFilterGroup,
            _id: createAdvancedGroupId()
        }])
    }, [advancedFilterGroups, blankFilterGroup, createAdvancedGroupId, setAdvancedFilterGroups])

    const changeGroup = useCallback((rowId, updated) => {
        const groups = advancedFilterGroups()
        const sourceRows = groups.some(group => group._id === rowId)
            ? groups
            : [...groups, blankFilterGroup]
        const next = changeAdvancedFilterRow({
            rows: sourceRows,
            rowId,
            changes: updated
        })
        if (next !== sourceRows) setAdvancedFilterGroups(next)
    }, [advancedFilterGroups, blankFilterGroup, setAdvancedFilterGroups])

    const removeGroup = useCallback(rowId => {
        const next = removeAdvancedFilterRow({
            rows: advancedFilterGroups(),
            rowId
        })
        setAdvancedFilterGroups(next)
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    return {
        visibleFilterGroups,
        addFilter,
        changeGroup,
        removeGroup
    }
}
