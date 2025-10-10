import React, {useCallback, useContext, useMemo, useState} from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FilterContext from '../context/FilterContext.jsx'
import AdvancedFilterValues from './AdvancedFilterValues'
import AuthContext from '../app/AuthContext.jsx'
import AppContext from '../app/AppContext.jsx'

export default function AdvancedFilterField({group = {}, onChange}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {beta} = useContext(AppContext)
    const {filterFields, advancedFilterGroups} = useContext(FilterContext)
    const {fieldName = '', matchType = 'Is'} = group

    const [filterField, setFilterField] = useState(fieldName)

    const options = useMemo(() => filterFields
        .filter(field => {
            return (!field.beta || beta) && (!field.userBased || isLoggedIn)
        })
        .filter(field => {
        return !advancedFilterGroups().some(group => group.fieldName === field.fieldName && field.fieldName !== fieldName)
    }), [advancedFilterGroups, beta, fieldName, filterFields, isLoggedIn])

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
        <div style={{display: 'flex', flexWrap: 'wrap', margin: '0px 0 24px 0', alignItems: 'flex-start'}}>
            <div style={{display: 'flex', alignItems: 'flex-start', marginTop: 8}}>
                <FormControl style={{width: 200, marginRight: 16, marginTop: 8}} size='small'>
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
                <FormControl style={{width: 90, marginRight: 16, marginTop: 8}} size='small'>
                    <Select
                        value={matchType}
                        onChange={handleMatchType}
                        color='info'
                        name='matchType'
                        style={{backgroundColor: matchType === 'Is Not' ? '#642c2c' : undefined}}
                    >
                        <MenuItem value={'Is'}>Is</MenuItem>
                        <MenuItem value={'Is Not'}>Is Not</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div style={{display: 'flex', alignItems: 'flex-start', marginTop: 8}}>
                <AdvancedFilterValues group={group} onChange={onChange}/>
            </div>

        </div>
    )
}