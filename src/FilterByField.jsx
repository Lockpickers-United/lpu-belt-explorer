import React, {useMemo} from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

function FilterByField({data, label, fieldName, onFilter}) {
    const handleSelect = event => {
        onFilter(fieldName, event.target.value)
        setTimeout(() => document.activeElement.blur())
    }

    const handleBlur = () => {
        setTimeout(() => document.activeElement.blur())
    }

    const uniqueValues = useMemo(() => {
        const allValues = data.map(datum => datum[fieldName]).flat()
        return [...new Set(allValues)].sort()
    }, [])

    return (
        <FormControl sx={{minWidth: 120}}>
            <InputLabel>{label}</InputLabel>
            <Select
                value=''
                onChange={handleSelect}
                style={{marginBottom: 8}}
                onClose={handleBlur}
            >
                {uniqueValues.map((value, index) =>
                    <MenuItem key={index} value={value}>{value}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

export default FilterByField
