import React, {useCallback, useContext, useMemo} from 'react'
import FieldValue from '../entries/FieldValue.jsx'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import FilterContext from '../contexts/FilterContext.jsx'
import {filterFieldsByFieldName} from '../data/filterFields.js'
import AppContext from '../contexts/AppContext.jsx'

function FilterDisplay() {
    const {filters, filterCount, removeFilter} = useContext(FilterContext)
    const {tab, setTab} = useContext(AppContext)

    const handleDeleteFilter = useCallback((keyToDelete, valueToDelete) => () => {
        if (filterCount === 1 && !filters.search && tab === 'search') setTab('White')
        setTimeout(() => removeFilter(keyToDelete, valueToDelete), 100)
    }, [tab, setTab, filterCount, filters.search, removeFilter])

    const filterValues = useMemo(() => {
        const {search, ...rest} = filters
        return Object.keys(rest)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subValue => ({key, value: subValue}))
                    : {key, value}
            })
            .flat()
    }, [filters])

    if (filterCount === 0) return null
    return (
        <FieldValue name='Current Filters' value={
            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginRight: -24}}>
                {filterValues.map(({key, value: filter}, index) =>
                    <Chip
                        key={index}
                        label={`${filterFieldsByFieldName[key].label} = ${filter}`}
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
