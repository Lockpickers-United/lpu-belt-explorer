import React, {useCallback, useContext, useMemo} from 'react'
import FilterContext from '../context/FilterContext.jsx'
import AdvancedFilterByField from './AdvancedFilterByField.jsx'
import ChoiceButtonGroup from '../util/ChoiceButtonGroup.jsx'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export default function AdvancedFilterValues({group = {}, onChange}) {

    const {fieldName = '', matchType='Is', operator = 'OR', values = [], groupIndex = 0} = group

    const {filterFields} = useContext(FilterContext)
    const filterField = filterFields.find(f => f.fieldName === fieldName) || {}
    const operatorOptions = useMemo(() => {
        return [
            {label: 'OR', value: 'OR'},
            {label: 'AND', value: 'AND'}
        ]
    }, [])

    const handleAddValue = useCallback(() => {
        const nextValues = [...values, '']
        onChange && onChange({values: nextValues})
    }, [onChange, values])

    const handleOperatorChange = useCallback((selected) => {
        const nextOp = selected?.value || selected?.label || 'OR'
        onChange && onChange({operator: nextOp})
    }, [onChange])

    const handleSetValueAt = useCallback((idx, newVal) => {
        const nextValues = values.map((v, i) => (i === idx ? newVal : v))
        onChange && onChange({values: nextValues})
    }, [onChange, values])

    const handleRemoveAt = useCallback((idx) => {
        const nextValues = values.filter((_, i) => i !== idx)
        onChange && onChange({values: nextValues})
    }, [onChange, values])

    return (
        <div>
            {values.length > 0 && values.map((val, index) => (
                <div key={index} style={{display: 'block', width: 250}}>
                    <AdvancedFilterByField
                        key={index}
                        group={group}
                        groupIndex={groupIndex}
                        matchType={matchType}
                        operator={operator}
                        valueIndex={index}
                        label={filterField.label}
                        fieldName={fieldName}
                        currentValue={val}
                        groupValues={values}
                        onFilter={(newVal) => handleSetValueAt(index, newVal)}
                        onRemove={() => handleRemoveAt(index)}
                        sort={null}
                        tab={'search'}
                        size={'small'}
                    />
                    {index === 0 && values.length > 1 && (
                        <ChoiceButtonGroup
                            options={operatorOptions}
                            defaultValue={operator}
                            onChange={handleOperatorChange}
                            small={true}
                            style={{margin: '12px 0 8px 0'}}
                        />
                    )}
                    {index === values.length - 1 && (
                        <div style={{display: 'flex', justifyContent: 'right', marginRight: 36}}>
                            <Button onClick={handleAddValue} style={{color: '#5d854f', marginTop: 4}}
                                    startIcon={<AddCircleIcon fontSize='large'/>}>
                                Add Value</Button>
                        </div>
                    )}
                </div>
            ))}

            {values.length === 0 && (
                <AdvancedFilterByField
                    key={0}
                    group={group}
                    groupIndex={groupIndex}
                    matchType={matchType}
                    operator={operator}
                    label={filterField.label}
                    fieldName={fieldName}
                    currentValue={''}
                    groupValues={values}
                    onFilter={(newVal) => onChange && onChange({values: [newVal]})}
                    onRemove={() => onChange && onChange({values: []})}
                    sort={null}
                    tab={'search'}
                    size={'small'}
                />
            )}

        </div>
    )
}