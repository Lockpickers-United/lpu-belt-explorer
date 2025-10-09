import React, {useCallback, useContext, useMemo, useState} from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import DataContext from '../context/DataContext'
import {filterValueNames} from '../data/filterValues'
import IconButton from '@mui/material/IconButton'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {setDeepUnique} from '../util/setDeep'
import filterEntriesAdvanced from './filterEntriesAdvanced'
import FilterContext from '../context/FilterContext.jsx'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddCircleIcon from '@mui/icons-material/AddCircle'

function AdvancedFilterByField({
                                   label,
                                   group,
                                   operator,
                                   valueIndex,
                                   currentValue,
                                   onFilter,
                                   onRemove,
                                   handleAddValue,
                                   sort,
                                   size = 'medium',
                                   context
                               }) {

    const {mappedBeltEntries} = useContext(DataContext)
    const {advancedFilterGroups, setAdvancedFilterGroups} = useContext(FilterContext)
    const {fieldName, groupIndex = 0, matchType, values = []} = group
    let otherFilterGroups = [...advancedFilterGroups()]
    otherFilterGroups.splice(groupIndex, 1)

    let currentValueText = Array.isArray(values) ? values.join(operator === 'OR' ? ' OR ' : ' AND ') : values
    currentValueText = matchType === 'Is Not' ? `NOT ${currentValueText}` : currentValueText

    const optionEntries = useMemo(() => {
        if (groupIndex === 0 && (!valueIndex || valueIndex === 0)) {
            return mappedBeltEntries
        } else if ((groupIndex > 0 && (!valueIndex || valueIndex === 0)) || (valueIndex > 0 && operator === 'OR')) {
            // Previous Group Entries
            return filterEntriesAdvanced({
                advancedFilterGroups: advancedFilterGroups(),
                entries: mappedBeltEntries,
                groupIndex: groupIndex - 1,
                valueIndex: 99
            })
        } else if (valueIndex > 0 && operator === 'AND') {
            // Previous Value Entries
            return filterEntriesAdvanced({
                advancedFilterGroups: advancedFilterGroups(),
                entries: mappedBeltEntries,
                groupIndex: groupIndex,
                valueIndex: valueIndex - 1
            })
        }
        return []
    }, [advancedFilterGroups, groupIndex, mappedBeltEntries, operator, valueIndex])

    const [open, setOpen] = useState(false)

    const {options, counts, negativeCounts, valueIdSets} = useMemo(() => {
        const filterEntries = optionEntries.reduce((acc, entry) => {
            if (Array.isArray(entry[fieldName])) {
                entry[fieldName].forEach(value => {
                    setDeepUnique(acc, [value], entry.id)
                })
            } else setDeepUnique(acc, [entry[fieldName]], entry.id)
            return acc
        }, {})
        const counts = Object.entries(filterEntries).reduce((acc, [key, ids]) => {
            acc[key] = ids.length
            return acc
        }, {})
        const negativeCounts = Object.entries(filterEntries).reduce((acc, [key, ids]) => {
            acc[key] = optionEntries.length - ids.length
            return acc
        }, {})
        const valueIdSets = Object.entries(filterEntries).reduce((acc, [key, ids]) => {
            acc[key] = new Set([...ids])
            return acc
        }, {})

        let allValues = Array.from(new Set([...Object.keys(counts), currentValue, currentValueText]))
            .filter(v => v && String(v).length > 0 && v !== 'undefined')

        const otherValues = values.filter(v => v !== currentValue)
        if (allValues.length > 0) allValues = allValues.filter(item => !otherValues.includes(item))
        if (allValues.length === 0) allValues = ['no more options']

        const options = allValues
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
        return {counts, options, negativeCounts, valueIdSets}
    }, [currentValue, currentValueText, fieldName, optionEntries, sort, values])

    const baseSelectedValues = useMemo(() => {
        if (!Array.isArray(values)) return []
        return values
            .map((v, i) => ({v, i}))
            .filter(({v, i}) => i !== valueIndex && v && String(v).length > 0)
            .map(({v}) => v)
    }, [values, valueIndex])

    const handleSelect = useCallback(event => {
        setOpen(false)
        const val = event.target.value
        if (val === 'no more options') return
        setTimeout(() => onFilter && onFilter(val), 0)
        setTimeout(() => document.activeElement.blur())
    }, [onFilter])

    const handleClose = useCallback(() => {
        setOpen(false)
        setTimeout(() => document.activeElement.blur())
    }, [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const handleRemoveGroup = useCallback(() => {
        const groups = advancedFilterGroups()
        let next = groups.filter((_, i) => i !== groupIndex)
        if (next.length === 0) next = [{
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName: '',
            matchType: 'Is',
            operator: 'OR',
            values: []
        }]
        setAdvancedFilterGroups(next)
    }, [advancedFilterGroups, groupIndex, setAdvancedFilterGroups])

    const handleRemoveValue = useCallback(() => {
        onRemove && onRemove()
    }, [onRemove])

    const marginBottom = context === 'drawer' ? 10 : 4
    const selectStyle = context !== 'drawer'
        ? {backgroundColor: currentValue.length > 0 ? '#333' : undefined}
        : matchType === 'Is Not'
            ? {backgroundColor: currentValue.length > 0 ? '#642c2c' : undefined}
            : {backgroundColor: currentValue.length > 0 ? '#555' : undefined}


    return (
        <div style={{display: 'flex', alignItems: 'center', height: 48, marginBottom: marginBottom}}>
            {(options.length === 0 || fieldName.length === 0) ? null :
                <FormControl style={{width: 210, minWidth: 210, marginTop: 8, marginRight: 4}}
                             size={size === 'small' ? 'small' : 'medium'}
                             fullWidth>
                    <InputLabel id={`filter-${fieldName}`} color='secondary'>{label}</InputLabel>
                    <Select
                        label={label}
                        labelId={`filter-${fieldName}`}
                        value={context === 'drawer' ? currentValueText : currentValue}
                        onChange={handleSelect}
                        style={selectStyle}
                        color='secondary'
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        onBlur={handleClose}
                    >
                        {options.map((opt, index) => {
                            let count
                            if (matchType === 'Is') {
                                count = counts[opt] || 0
                            } else {
                                if (operator === 'AND') {
                                    // NOT with AND: previous values (if any) already applied in optionEntries for valueIndex>0
                                    count = negativeCounts[opt] || 0
                                } else {
                                    // NOT with OR: need entries that do NOT have any of (baseSelectedValues ∪ {opt})
                                    const unionIds = new Set()
                                    const allForbidden = [...baseSelectedValues, opt]
                                    allForbidden.forEach(v => {
                                        const set = valueIdSets[v]
                                        if (set) {
                                            set.forEach(id => unionIds.add(id))
                                        }
                                    })
                                    count = (optionEntries?.length || 0) - unionIds.size
                                }
                            }
                            return <MenuItem key={index} value={opt}>
                                {filterValueNames[opt] ? filterValueNames[opt] : opt + (currentValue === opt ? '' : ` (${count})`)}
                            </MenuItem>
                        })}
                    </Select>
                </FormControl>
            }
            {context !== 'drawer' &&
                <React.Fragment>
                    {valueIndex === 0 && currentValue.length > 0 &&
                        <IconButton aria-label='add filter group' onClick={handleAddValue}
                                    style={{marginTop: 4, marginLeft: 2}} size='small'>
                            <AddCircleIcon fontSize='small' style={{color: '#5d854f'}}/>
                        </IconButton>
                    }
                    {(currentValue.length > 0 || valueIndex > 0) &&
                        <IconButton aria-label='remove filter value' onClick={handleRemoveValue}
                                    style={{marginTop: 4, marginLeft: 2}} size='small'>
                            <HighlightOffIcon fontSize='small' style={{color: '#d04e4e'}}/>
                        </IconButton>
                    }
                    {(!valueIndex || valueIndex === 0) &&
                        <IconButton aria-label='remove filter group' onClick={handleRemoveGroup}
                                    style={{marginTop: 4, marginLeft: 2}} size='small'>
                            <DeleteOutlineIcon fontSize='small' style={{color: '#eee'}}/>
                        </IconButton>
                    }
                </React.Fragment>
            }
            {(currentValue.length > 0 || valueIndex > 0) && context === 'drawer' &&
                <IconButton aria-label='remove filter value' onClick={handleRemoveGroup}
                            style={{marginTop: 4, marginLeft: 2}} size='small'>
                    <HighlightOffIcon fontSize='small' style={{color: '#d04e4e'}}/>
                </IconButton>
            }

        </div>
    )
}

export default AdvancedFilterByField
