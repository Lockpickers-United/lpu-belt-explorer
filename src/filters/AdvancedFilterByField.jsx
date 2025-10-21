import React, {useCallback, useContext, useMemo, useState} from 'react'
import DataContext from '../context/DataContext'
import {filterValueNames} from '../data/filterValues'
import IconButton from '@mui/material/IconButton'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {setDeepUnique} from '../util/setDeep'
import filterEntriesAdvanced from './filterEntriesAdvanced'
import FilterContext from '../context/FilterContext.jsx'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import useWindowSize from '../util/useWindowSize.jsx'
import AdvancedSelect from './AdvancedSelect.jsx'
import AdvancedSelectAutoComplete from './AdvancedSelectAutoComplete.jsx'

function AdvancedFilterByField({
                                   label,
                                   active = false,
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

    if (!label || label.length === 0) return null

    const {searchedEntries, searchedBeltEntries, visibleEntries, visibleBeltEntries} = useContext(DataContext)
    const {advancedFilterGroups, setAdvancedFilterGroups} = useContext(FilterContext)
    const {fieldName, groupIndex, matchType, values = []} = group

    const baseEntries = useMemo(() => searchedBeltEntries || searchedEntries || [], [searchedBeltEntries, searchedEntries])
    const visEntries = useMemo(() => visibleBeltEntries || visibleEntries || [], [visibleBeltEntries, visibleEntries])

    let otherFilterGroups = [...advancedFilterGroups()]
    otherFilterGroups.splice(groupIndex, 1)

    let currentValueText = Array.isArray(values) ? values.filter(value => value && String(value).length > 0)
        .join(operator === 'OR' ? ' OR ' : ' AND ') : values
    currentValueText = matchType === 'Is Not' ? `NOT ${currentValueText}` : currentValueText

    const optionEntries = useMemo(() => {
        if (!active) {
            return baseEntries
        } else if (groupIndex === 0 && (!valueIndex || valueIndex === 0)) {
            return baseEntries
        } else if ((groupIndex > 0 && (!valueIndex || valueIndex === 0)) || (valueIndex > 0 && operator === 'OR')) {
            // Previous Group Entries
            return filterEntriesAdvanced({
                advancedFilterGroups: advancedFilterGroups(),
                entries: baseEntries,
                groupIndex: groupIndex - 1,
                valueIndex: 99
            })
        } else if (valueIndex > 0 && operator === 'AND') {
            // Previous Value Entries
            return filterEntriesAdvanced({
                advancedFilterGroups: advancedFilterGroups(),
                entries: baseEntries,
                groupIndex: groupIndex,
                valueIndex: valueIndex - 1
            })
        }
        return []
    }, [active, groupIndex, valueIndex, operator, baseEntries, advancedFilterGroups])

    const {options, counts} = useMemo(() => {
        // Build available values for this field from the optionEntries (derived from prior groups/values)
        const filterEntries = optionEntries.reduce((acc, entry) => {
            if (Array.isArray(entry[fieldName])) {
                entry[fieldName].forEach(value => {
                    setDeepUnique(acc, [value], entry.id)
                })
            } else setDeepUnique(acc, [entry[fieldName]], entry.id)
            return acc
        }, {})

        let allValues = context === 'drawer'
            ? Array.from(new Set([...Object.keys(filterEntries), currentValue, currentValueText]))
            : Array.from(new Set([...Object.keys(filterEntries), currentValue]))
        allValues = allValues.filter(v => v && String(v).length > 0 && v !== 'undefined')

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

        // For each option, compute the resulting count by applying filters including this option via filterEntriesAdvanced
        const counts = options.reduce((acc, opt) => {
            if (opt === 'no more options') {
                acc[opt] = 0
                return acc
            }
            const groups = advancedFilterGroups()
            const updatedGroups = groups.map((g, idx) => {
                if (idx !== groupIndex) return g
                // For OR operator, show per-option count by applying only the candidate value
                if ((g.operator || operator) === 'OR') {
                    return {...g, values: [opt]}
                }
                // For AND (and others), keep existing semantics of combining values
                const nv = Array.isArray(values) ? [...values] : []
                if (typeof valueIndex === 'number') {
                    if (nv.length === 0) nv.push(opt)
                    else nv[valueIndex] = opt
                } else {
                    nv.push(opt)
                }
                const cleaned = nv.filter(v => v !== undefined && v !== null && String(v).length > 0)
                return {...g, values: cleaned}
            })
            let result
            if (!active) {
                // For inactive filters, compute matches by applying only the candidate option
                // against the current visibleEntries (which already reflect active filters).
                const tempGroup = [{
                    fieldName,
                    matchType,
                    operator: 'OR',
                    values: [opt]
                }]
                result = filterEntriesAdvanced({
                    advancedFilterGroups: tempGroup,
                    entries: visEntries,
                    groupIndex: 0
                })
            } else {
                // For active filters, compute matches by including this option within the current groups up to this point
                result = filterEntriesAdvanced({
                    advancedFilterGroups: updatedGroups.slice(0, groupIndex + 1),
                    entries: baseEntries
                })
            }
            acc[opt] = Array.isArray(result) ? result.length : 0
            return acc
        }, {})

        return {counts, options}
    }, [optionEntries, context, currentValue, currentValueText, fieldName, sort, advancedFilterGroups, active, groupIndex, operator, values, valueIndex, matchType, visEntries, baseEntries])

    const otherValues = Array.isArray(values) ? values.filter((_, i) => i !== valueIndex) : []
    let filteredOptions = options
        .filter(opt => {
            return (counts[opt] > 0)
                && ((opt !== currentValue || opt !== currentValueText) || counts[opt] !== visibleEntries.length)
                || (opt === currentValue || opt === currentValueText)
        })
        .filter(opt => !otherValues.includes(opt))
    if (filteredOptions.length === 0) {
        filteredOptions = ['no more options']
    }
    const noMoreOptions = filteredOptions.length === 1 && filteredOptions[0] === 'no more options'

    const displayValueText = noMoreOptions
        ? 'no more options'
        : context === 'drawer'
            ? currentValueText
            : currentValue

    const [_open, setOpen] = useState(false)

    const handleSelect = useCallback(event => {
        setOpen(false)
        const val = event.target.value
        if (val === 'no more options') return
        setTimeout(() => onFilter && onFilter(val), 0)
        setTimeout(() => document.activeElement.blur())
    }, [onFilter])


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

    const marginBottom = context === 'drawer' ? 18 : 12
    const selectStyle = context !== 'drawer'
        ? {backgroundColor: currentValue?.length > 0 ? '#333' : undefined}
        : matchType === 'Is Not'
            ? {backgroundColor: currentValue.length > 0 ? '#733030  ' : undefined}
            : {backgroundColor: currentValue.length > 0 ? '#555' : undefined}

    const {isMobile} = useWindowSize()
    const fieldWidth = isMobile || context === 'drawer' ? 210 : 250
    const buttonSize = isMobile ? 'medium' : 'small'

    const props = {
        label,
        size,
        filteredOptions,
        filterValueNames,
        counts,
        fieldName,
        fieldWidth,
        noMoreOptions,
        displayValueText,
        handleSelect,
        selectStyle
    }

    const autocompleteFields = ['makes']
    return (
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
            {(filteredOptions?.length === 0 || fieldName?.length === 0)
                ? null
                : autocompleteFields.includes(fieldName)
                    ? <AdvancedSelectAutoComplete props={props}/>
                    : <AdvancedSelect props={props}/>
            }


            {context !== 'drawer' &&
                <React.Fragment>
                    {valueIndex === 0 && currentValue?.length > 0 &&
                        <IconButton aria-label='add filter group' onClick={handleAddValue}
                                    style={{marginTop: 4, marginLeft: 2}} size={buttonSize}>
                            <AddCircleIcon fontSize={buttonSize} style={{color: '#5d854f'}}/>
                        </IconButton>
                    }
                    {(currentValue?.length > 0 || valueIndex > 0) &&
                        <IconButton aria-label='remove filter value' onClick={handleRemoveValue}
                                    style={{marginTop: 4, marginLeft: 2}} size={buttonSize}>
                            <HighlightOffIcon fontSize={buttonSize} style={{color: '#d04e4e'}}/>
                        </IconButton>
                    }
                    {(!valueIndex || valueIndex === 0) && fieldName &&
                        <IconButton aria-label='remove filter group' onClick={handleRemoveGroup}
                                    style={{marginTop: 4, marginLeft: 2}} size={buttonSize}>
                            <DeleteOutlineIcon fontSize={buttonSize} style={{color: '#eee'}}/>
                        </IconButton>
                    }
                </React.Fragment>
            }
            {(currentValue?.length > 0 || valueIndex > 0) && context === 'drawer' &&
                <IconButton aria-label='remove filter value' onClick={handleRemoveGroup}
                            style={{marginTop: 4, marginLeft: 2}} size={buttonSize}>
                    <HighlightOffIcon fontSize={buttonSize} style={{color: '#d04e4e'}}/>
                </IconButton>
            }
        </div>
    )
}

export default AdvancedFilterByField
