import React, {useCallback, useContext, useDeferredValue, useMemo, useState} from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import DataContext from '../locks/LockDataProvider'
import FilterContext from '../context/FilterContext'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import {filterValueNames} from '../data/filterValues'
import IconButton from '@mui/material/IconButton'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

function FilterByField({label, fieldName, onFilter, sort}) {
    const {beltEntries = []} = useContext(DataContext)
    const {filters, removeFilters} = useContext(FilterContext)

    const [open, setOpen] = useState(false)
    const defFilters = useDeferredValue(filters)
    const filterValue = defFilters[fieldName]
    const value = useMemo(() => {
        return Array.isArray(filterValue)
            ? defFilters[fieldName]
            : (filterValue ? [filterValue] : [])
    }, [defFilters, fieldName, filterValue])

    const {counts, options} = useMemo(() => {

        let allValues = beltEntries
            .map(datum => Array.isArray(datum[fieldName])
                ? Array.from(new Set([...datum[fieldName]]))
                : datum[fieldName])
            .flat()
            .filter(x => x)
        const counts = allValues.reduce((acc, val) => {
            if (!acc[val]) acc[val] = 0
            acc[val]++
            return acc
        }, {})

        const options = Object.keys(counts)
            .sort((a, b) => {
                if (sort) return sort(a, b)
                else {
                    if (typeof a === 'string' && typeof b === 'string') {
                        return a.localeCompare(b)
                    } else if (Number.isInteger(a) && Number.isInteger(b)) {
                        return a - b
                    }
                }
            })
        return {counts, options}
    }, [beltEntries, fieldName, sort])

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

    const handleRemove = useCallback(() => {
        removeFilters([fieldName])
    }, [fieldName, removeFilters])

    const excludedOptions = value.reduce((acc, val) => {
        return [...acc, (val.startsWith('!')) ? val : null]
    }, []).filter(x => x)
    const fullOptions = [...excludedOptions, ...options]

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {fullOptions.length === 0 ? null :
                <FormControl style={{minWidth: 120, maxWidth: 300, marginTop: 8}} fullWidth>
                    <InputLabel id={`filter-${fieldName}`} color='secondary'>{label}</InputLabel>
                    <Select
                        multiple
                        label={label}
                        labelId={`filter-${fieldName}`}
                        value={value}
                        onChange={handleSelect}
                        style={{marginBottom: 0}}
                        color='secondary'
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
                                {selected.map((value) => {
                                    const valueText = value.startsWith('!')
                                        ? 'NOT ' + (filterValueNames[value.slice(1)] ? filterValueNames[value.slice(1)] : value.slice(1)).replace('||', ' OR ').replace('@@', ' AND ')
                                        : filterValueNames[value] ? filterValueNames[value] : value.replace('||', ' OR ').replace('@@', ' AND ')
                                    return (
                                        <Chip key={value}
                                              label={valueText}/>
                                    )
                                })}
                            </Box>
                        }
                    >
                        {fullOptions.map((value, index) =>
                            <MenuItem key={index} value={value}>
                                {(value || '').startsWith('!')
                                    ? 'NOT ' + (filterValueNames[value.slice(1)] ? filterValueNames[value.slice(1)] : value.slice(1))
                                    : filterValueNames[value] ? filterValueNames[value] : value + ` (${counts[value] || 0})`}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
            }
            {value.length === 0 ? null :
                <IconButton onClick={handleRemove} style={{height: 30, marginTop: 4, marginLeft: 2}} size='small'>
                    <HighlightOffIcon fontSize='small' style={{color: '#d04e4e'}}/>
                </IconButton>
            }
        </div>
    )
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

export default FilterByField
