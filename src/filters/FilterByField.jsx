import React, {useCallback, useContext, useDeferredValue, useMemo, useState} from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import DataContext from '../contexts/DataContext'
import FilterContext from '../contexts/FilterContext'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

function FilterByField({label, fieldName, onFilter, sort}) {
    const {visibleEntries} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const [open, setOpen] = useState(false)

    const handleSelect = useCallback(event => {
        setOpen(false)
        setTimeout(() => onFilter(fieldName, event.target.value, true), 0)
        setTimeout(() => document.activeElement.blur())
    }, [fieldName, onFilter])

    const handleClose = useCallback(() => {
        setOpen(false)
        setTimeout(() => document.activeElement.blur())
    }, [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const {counts, options} = useMemo(() => {
        const allValues = visibleEntries
            .map(datum => datum[fieldName])
            .flat()
            .filter(x => x)

        const counts = allValues.reduce((acc, val) => {
            if (!acc[val]) acc[val] = 0
            acc[val]++
            return acc
        }, {})


        const options = [...new Set(allValues)]
            .sort((a, b) => sort ? sort(a, b) : a.localeCompare(b))

        return {counts, options}
    }, [fieldName, visibleEntries, sort])

    const defFilters = useDeferredValue(filters)
    const filterValue = defFilters[fieldName]
    const value = Array.isArray(filterValue)
        ? defFilters[fieldName]
        : (filterValue ? [filterValue] : [])

    return (
        <FormControl style={{minWidth: 120, maxWidth: 300, marginTop: 4}} fullWidth>
            <InputLabel id={`filter-${fieldName}`}>{label}</InputLabel>
            <Select
                multiple
                label={label}
                labelId={`filter-${fieldName}`}
                value={value}
                onChange={handleSelect}
                style={{marginBottom: 8}}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                onBlur={handleClose}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 8 + ITEM_PADDING_TOP
                        }
                    }
                }}
                renderValue={selected =>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                }
            >
                {options.map((value, index) =>
                    <MenuItem key={index} value={value}>
                        {`${value} (${counts[value] || 0})`}
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

export default FilterByField
