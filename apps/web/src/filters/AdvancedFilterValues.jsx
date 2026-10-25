import React, {useCallback, useContext, useMemo} from 'react'
import FilterContext from '../context/FilterContext.jsx'
import AdvancedFilterByField from './AdvancedFilterByField.jsx'
import ChoiceButtonGroup from '../util/ChoiceButtonGroup.jsx'

export default function AdvancedFilterValues({group = {}, onChange}) {

    const {fieldName = '', matchType = 'Is', operator = 'OR', values = [], groupIndex = 0} = group

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
                        {...filterField}
                        active={true}
                        group={group}
                        groupIndex={groupIndex}
                        matchType={matchType}
                        operator={operator}
                        valueIndex={index}
                        currentValue={val}
                        groupValues={values}
                        onFilter={(newVal) => handleSetValueAt(index, newVal)}
                        onRemove={() => handleRemoveAt(index)}
                        handleAddValue={handleAddValue}
                        size='small'
                    />
                    {index === 0 && values.length > 1 && (
                        <ChoiceButtonGroup
                            options={operatorOptions}
                            defaultValue={operator}
                            onChange={handleOperatorChange}
                            small={true}
                            rounded
                            style={{margin: '0px 0 13px 0'}}
                        />
                    )}
                </div>
            ))}

            {values.length === 0 &&
                <AdvancedFilterByField
                    key={0}
                    {...filterField}
                    active={true}
                    group={group}
                    groupIndex={groupIndex}
                    matchType={matchType}
                    operator={operator}
                    currentValue={''}
                    onFilter={(newVal) => onChange && onChange({values: [newVal]})}
                    onRemove={() => onChange && onChange({values: []})}
                    handleAddValue={handleAddValue}
                    size='small'
                />
            }

        </div>
    )
}