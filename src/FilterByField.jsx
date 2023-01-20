import React, {useMemo} from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import data from './data/data.json'

function FilterByField({field, onFilter}) {
    const key = field.toLowerCase()

    const handleSelect = event => {
        onFilter(field.toLowerCase(), event.target.value)
        setTimeout(() => document.activeElement.blur())
    }

    const handleBlur = () => {
        setTimeout(() => document.activeElement.blur())
    }

    const uniqueValues = useMemo(() => {
        const allValues = data.map(datum => datum[key]).flat()
        return [...new Set(allValues)].sort()
    }, [])

    return (
        <FormControl sx={{minWidth: 120}}>
            <InputLabel>{`Filter by ${field}`}</InputLabel>
            <Select
                value='' label={`Filter by ${field}`}
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
