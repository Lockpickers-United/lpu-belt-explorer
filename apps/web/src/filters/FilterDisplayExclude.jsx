import React, {useCallback, useContext, useMemo} from 'react'
import Stack from '@mui/material/Stack'
import FilterContext from '../context/FilterContext'
import {filterValueNames} from '../data/filterValues'
import FilterChipExclude from './FilterChipExclude'

function FilterDisplay() {
    const {
        filterCount,
        filterFieldsByFieldName,
        activeFilterGroups,
        advancedFilterGroups,
        setAdvancedFilterGroups
    } = useContext(FilterContext)

    const activeGroups = activeFilterGroups()

    const handleDeleteFilter = useCallback(fieldName => {
        setAdvancedFilterGroups(advancedFilterGroups()
            .filter(group => group.fieldName !== fieldName))
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    const handleToggleFilter = useCallback(fieldName => {
        setAdvancedFilterGroups(advancedFilterGroups().map(group => (
            group.fieldName === fieldName
                ? {...group, matchType: group.matchType === 'Is Not' ? 'Is' : 'Is Not'}
                : group
        )))
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    const cleanChipLabel = useCallback((label, value) => {
        if (label === 'Belt') {
            if (value === 'Unranked') {
                return label
            }
            if (value.includes('Black')) {
                return value.replace(/(Black)\s(\d+)/, '$1 Belt $2')
            } else {
                return value + ' Belt'
            }
        } else if (label === 'UL Group') {
            return 'Group ' + value
        } else if (label === 'Wheels') {
            return `${value} Wheels`
        } else if (filterValueNames[value]) {
            return filterValueNames[value]
        }
        return value
    }, [])




    const chips = useMemo(() => activeGroups.map(group => {
        const fieldLabel = filterFieldsByFieldName[group.fieldName]?.label
        const delimiter = group.operator === 'AND' ? ' AND ' : ' OR '
        const values = group.values.map(value => cleanChipLabel(fieldLabel, String(value)))
        const negative = group.matchType === 'Is Not'
        return {
            fieldName: group.fieldName,
            label: `${negative ? 'NOT ' : ''}${values.join(delimiter)}`,
            negative
        }
    }), [activeGroups, cleanChipLabel, filterFieldsByFieldName])

    if (filterCount === 0) return null
    return (
            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginTop: 12}}>
                {chips.map(chip => {
                    return <React.Fragment key={chip.fieldName}>
                            <FilterChipExclude
                                label={chip.label}
                                negative={chip.negative}
                                onToggle={() => handleToggleFilter(chip.fieldName)}
                                onDelete={() => handleDeleteFilter(chip.fieldName)}
                                variant='outlined'
                                style={{marginRight: 4, marginBottom: 4}}
                            />
                        </React.Fragment>
                    }
                )}
            </Stack>
    )
}

export default FilterDisplay
