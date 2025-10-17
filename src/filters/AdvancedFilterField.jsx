import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FilterContext from '../context/FilterContext.jsx'
import AdvancedFilterValues from './AdvancedFilterValues'
import AuthContext from '../app/AuthContext.jsx'
import AppContext from '../app/AppContext.jsx'
import {Collapse} from '@mui/material'
import ChoiceButtonGroupAdvanced from '../util/ChoiceButtonGroupAdvanced.jsx'

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

    const matchOptions = useMemo(() => {
        return [
            {label: 'Is', value: 'Is'},
            {label: 'Not', value: 'Is Not', backgroundColor: '#733030'}
        ]
    }, [])

    const handleMatchType = useCallback((selected) => {
        const nextOp = selected?.value || selected?.label || 'Is'
        onChange && onChange({matchType: nextOp})
    }, [onChange])


    const [visible, setVisible] = useState(false)
    useEffect(() => {
        setVisible(true)
    }, [])

    return (
        <Collapse in={visible || fieldName.length > 0} unmountOnExit>
            <div style={{display: 'flex', flexWrap: 'wrap', margin: '0px 0 12px 0', alignItems: 'flex-start'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', marginTop: 0}}>
                    <FormControl style={{width: 200, marginRight: 0, marginTop: 8}} size='small'>
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

                    <div style={{display:'flex', alignItems: 'center'}}>
                        <ChoiceButtonGroupAdvanced
                            options={matchOptions}
                            defaultValue={matchType}
                            onChange={handleMatchType}
                            small={false}
                            rounded
                            style={{height:40, margin: '8px 12px 8px 12px', borderRadius: 4}}
                        /><br/>
                    </div>
                </div>

                <div style={{display: 'flex', alignItems: 'flex-start', marginTop: 8}}>
                    <AdvancedFilterValues group={group} onChange={onChange}/>
                </div>

            </div>
        </Collapse>
    )
}