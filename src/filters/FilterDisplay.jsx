import React, {useCallback, useContext, useMemo} from 'react'
import FieldValue from '../entries/FieldValue'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import FilterContext from '../context/FilterContext'
import {filterValueNames} from '../data/filterValues'

function FilterDisplay() {
    const {
        filterCount,
        filterFieldsByFieldName,
        activeFilterGroups,
        advancedFilterGroups,
        setAdvancedFilterGroups
    } = useContext(FilterContext)

    const activeGroups = activeFilterGroups()

    const handleDeleteFilter = useCallback(fieldName => () => {
        setAdvancedFilterGroups(advancedFilterGroups()
            .filter(group => group.fieldName !== fieldName))
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    const cleanChipLabel = useCallback((label, value) => {
        if (label === 'Belt') {
            if (value === 'Unranked') {
                return value
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
        const label = filterFieldsByFieldName[group.fieldName]?.label
        const delimiter = group.operator === 'AND' ? ' AND ' : ' OR '
        const values = group.values.map(value => cleanChipLabel(label, String(value)))
        return {
            fieldName: group.fieldName,
            label: `${group.matchType === 'Is Not' ? 'NOT ' : ''}${values.join(delimiter)}`,
            negative: group.matchType === 'Is Not'
        }
    }), [activeGroups, cleanChipLabel, filterFieldsByFieldName])

    if (filterCount === 0) return null

    return (
        <FieldValue name='Current Filters' style={{marginBottom: 0}} value={
            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginRight: -24}}>
                {chips.map(chip => {
                        return <Chip
                            key={chip.fieldName}
                            label={chip.label}
                            variant='outlined'
                            style={{
                                marginRight: 4,
                                marginBottom: 4,
                                backgroundColor: chip.negative ? '#642c2c' : 'inherit'
                            }}
                            onDelete={handleDeleteFilter(chip.fieldName)}
                        />
                    }
                )}
            </Stack>
        }/>
    )
}

export default FilterDisplay
