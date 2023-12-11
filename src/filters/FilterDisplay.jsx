import React, {useCallback, useContext, useMemo} from 'react'
import FieldValue from '../entries/FieldValue'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import FilterContext from '../contexts/FilterContext'
import {filterFieldsByFieldName} from '../data/filterFields'

function FilterDisplay() {
    const {filters, filterCount, removeFilter} = useContext(FilterContext)

    const handleDeleteFilter = useCallback((keyToDelete, valueToDelete) => () => {
        removeFilter(keyToDelete, valueToDelete)
    }, [removeFilter])

    const filterValues = useMemo(() => {
        const {search, id, tab, name, sort, ...rest} = filters
        return Object.keys(rest)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subValue => ({key, value: subValue}))
                    : {key, value}
            })
            .flat()
    }, [filters])

    function cleanChipLabel(filterLabel, filterName) {
        if (filterLabel === 'Belt') {
            if (filterName === 'Unranked') {
                return filterName
            }
            if (filterName.includes('Black')) {
                return filterName.replace(/(Black)\s(\d+)/, '$1 Belt $2')
            } else {
                return filterName + ' Belt'
            }
        }
        return filterName
    }

    if (filterCount === 0) return null
    return (
        <FieldValue name='Current Filters' style={{marginBottom: 0}} value={
            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginRight: -24}}>
                {filterValues.map(({key, value: filter}, index) =>
                    <Chip
                        key={index}
                        label={`${cleanChipLabel(filterFieldsByFieldName[key]?.label, filter)}`}
                        variant='outlined'
                        style={{marginRight: 4, marginBottom: 4}}
                        onDelete={handleDeleteFilter(key, filter)}
                    />
                )}
            </Stack>
        }/>
    )
}

export default FilterDisplay
