import React, {useCallback, useContext, useMemo} from 'react'
import FieldValue from '../entries/FieldValue'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import FilterContext from '../context/FilterContext'
import {filterValueNames} from '../data/filterValues'

function FilterDisplay() {
    const {filters, filterCount, removeFilter, filterFieldsByFieldName} = useContext(FilterContext)

    const handleDeleteFilter = useCallback((keyToDelete, valueToDelete) => () => {
        removeFilter(keyToDelete, valueToDelete)
    }, [removeFilter])

    const filterValues = useMemo(() => {
        const {search, id, tab, name, sort, image, ...rest} = filters
        return Object.keys(rest)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subValue => ({key, value: subValue}))
                    : {key, value}
            })
            .flat()
    }, [filters])

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

    if (filterCount === 0) return null

    return (
        <FieldValue name='Current Filters' style={{marginBottom: 0}} value={
            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginRight: -24}}>
                {filterValues.map(({key, value: filter}, index) => {
                        const bgColor = filter.startsWith('!') ? '#642c2c' : 'inherit'
                        const chipLabel = cleanChipLabel(filterFieldsByFieldName[key]?.label, filter)
                            .replace('!', 'NOT ').replace('||', ' OR ').replace('@@', ' AND ')
                        return <Chip
                            key={index}
                            label={chipLabel}
                            variant='outlined'
                            style={{marginRight: 4, marginBottom: 4, backgroundColor: bgColor}}
                            onDelete={handleDeleteFilter(key, filter)}
                        />
                    }
                )}
            </Stack>
        }/>
    )
}

export default FilterDisplay
