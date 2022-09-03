import React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import data from './data.js'

function FilterByField({field, onFilter}) {
    const key = field.toLowerCase()
    const handleSelect = event => {
        onFilter(field.toLowerCase(), event.target.value)
        setTimeout(() => document.activeElement.blur())
    }
    const handleBlur = () => {
        setTimeout(() => document.activeElement.blur())
    }
    const allValues = data.map(datum => datum[key]).flat()
    const uniqueValues = [...new Set(allValues)].sort()

    return (
        <FormControl sx={{minWidth: 120}}>
            <InputLabel>{field}</InputLabel>
            <Select
                placeholder={`Filter by ${field}`} value='' label={field}
                onChange={handleSelect} style={{marginBottom: 8}} onClose={handleBlur}
            >
                {uniqueValues.map((value, index) =>
                    <MenuItem key={index} value={value}>{value}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

export default FilterByField
