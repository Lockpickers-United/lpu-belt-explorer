import React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import data from './data.js'

function FilterByField({field, onFilter}) {
    const key = field.toLowerCase()
    const handleSelect = event => onFilter(field.toLowerCase(), event.target.value)
    const allValues = data.map(datum => datum[key]).flat()
    const uniqueValues = [...new Set(allValues)]

    return (
        <FormControl sx={{minWidth: 120}}>
            <InputLabel>{field}</InputLabel>
            <Select value='' label={field} onChange={handleSelect}>
                {uniqueValues.map((value, index) =>
                    <MenuItem key={index} value={value}>{value}</MenuItem>
                )}
            </Select>
            <FormHelperText>Filter by {field}</FormHelperText>
        </FormControl>
    )
}

export default FilterByField
