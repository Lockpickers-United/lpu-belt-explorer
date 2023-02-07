import React, {useContext, useMemo} from 'react'
import FieldValue from './FieldValue.jsx'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import FilterContext from './FilterContext.jsx'
import {filterFieldsByFieldName} from './data/filterFields.js'
import Typography from '@mui/material/Typography'

function FilterDisplay() {
    const {filters, filterCount, removeFilter} = useContext(FilterContext)

    const handleDeleteFilter = (keyToDelete, valueToDelete) => () => {
        setTimeout(() => removeFilter(keyToDelete, valueToDelete), 0)
    }

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

    return (
        <FieldValue name='Current Filters' value={
            <React.Fragment>
                {filterCount === 0 && <Typography style={{minHeight: 36}}>No Filters</Typography>}
                <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginRight: -24}}>
                    {filterValues.map(({key, value: filter}, index) =>
                        <Chip
                            key={index}
                            label={`${filterFieldsByFieldName[key]} = ${filter}`}
                            variant='outlined'
                            style={{marginRight: 4, marginBottom: 4}}
                            onDelete={handleDeleteFilter(key, filter)}
                        />
                    )}
                </Stack>
            </React.Fragment>
        }/>
    )
}

export default FilterDisplay
