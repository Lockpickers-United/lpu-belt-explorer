import React, {useCallback, useContext, useMemo, useState} from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FilterContext from '../context/FilterContext.jsx'
import AdvancedFilterValues from './AdvancedFilterValues'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

export default function AdvancedFilterField({group = {}, onChange, onRemove}) {

    const {fieldName = '', matchType = 'Is'} = group
    const {filterFields, advancedFilterGroups} = useContext(FilterContext)
    const [filterField, setFilterField] = useState(fieldName)

    const options = useMemo(() => filterFields.filter(field => {
        return !advancedFilterGroups().some(group => group.fieldName === field.fieldName && field.fieldName !== fieldName)
    }), [advancedFilterGroups, fieldName, filterFields])

    const handleSelect = useCallback((event) => {
        const newField = event.target.value
        setFilterField(newField)
        onChange && onChange({fieldName: newField, values: []})
        setTimeout(() => document.activeElement.blur())
    }, [onChange])

    const handleMatchType = useCallback((event) => {
        onChange && onChange({matchType: event.target.value})
        setTimeout(() => document.activeElement.blur())
    }, [onChange])

    return (
        <div style={{display: 'flex', marginTop: 24, alignItems: 'flex-start'}}>
            <FormControl style={{width: 200, marginRight: 16, marginTop: 8}} size='medium'>
                <InputLabel color='info'>Filter</InputLabel>
                <Select
                    value={filterField}
                    label='Filter'
                    onChange={handleSelect}
                    color='info'
                    name='fieldName'
                >
                    {options.map((item, index) => (
                        <MenuItem key={index} value={item.fieldName}>{item.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl style={{width: 130, marginRight: 16, marginTop: 8}} size='medium'>
                <InputLabel color='info'>Match Type</InputLabel>
                <Select
                    value={matchType}
                    label='Match Type'
                    onChange={handleMatchType}
                    color='info'
                    name='matchType'
                >
                    <MenuItem value={'Is'}>Is</MenuItem>
                    <MenuItem value={'Is Not'}>Is Not</MenuItem>
                </Select>
            </FormControl>

            <AdvancedFilterValues group={group} onChange={onChange}/>

            <IconButton aria-label='remove filter group' onClick={onRemove} style={{marginTop: 14, marginLeft: 8}}>
                <DeleteOutlineIcon style={{color:'#eee'}}/>
            </IconButton>
        </div>
    )
}