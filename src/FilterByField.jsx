import React, {useCallback, useMemo} from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

function FilterByField({data, label, fieldName, values, onFilter}) {
    const handleSelect = useCallback(event => {
        onFilter(fieldName, event.target.value)
        setTimeout(() => document.activeElement.blur())
    }, [fieldName, onFilter])

    const handleBlur = useCallback(() => {
        setTimeout(() => document.activeElement.blur())
    }, [])

    const uniqueValues = useMemo(() => {
        if (values) return values

        const allValues = data.map(datum => datum[fieldName]).flat()
        return [...new Set(allValues)].sort()
    }, [data, fieldName, values])

    return (
        <FormControl sx={{minWidth: 120}}>
            <InputLabel id={`filter-${fieldName}`}>{label}</InputLabel>
            <Select
                label={label}
                labelId={`filter-${fieldName}`}
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
