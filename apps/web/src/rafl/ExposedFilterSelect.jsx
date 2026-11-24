import React, {useContext} from 'react'
import FilterChip from '../filters/FilterChip.jsx'
import FilterContext from '../context/FilterContext.jsx'
import DataContext from '../context/DataContext.jsx'

export default function ExposedFilterSelect({field, sequence = [], styles}) {

    const {filterFields} = useContext(FilterContext)
    const filterField = filterFields.find(f => f.fieldName === field)

    const {visibleEntries} = useContext(DataContext)
    const values = visibleEntries.reduce((acc, e) => {
        if (!e[field]) return acc
        if (Array.isArray(e[field])) {
            for (const val of e[field]) {
                acc[val] = (acc[val] || 0) + 1
            }
        } else {
            acc[e[field]] = (acc[e[field]] || 0) + 1
        }
        return acc
    }, {})
    const fieldValues = Object.keys(values).sort((a, b) => {
        const aIndex = sequence?.indexOf(a) ?? -1
        const bIndex = sequence?.indexOf(b) ?? -1
        if (aIndex === -1 && bIndex === -1) return values[b] - values[a]
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
    })

    const newIndex = fieldValues.indexOf('New')
    const updatedFieldValues = newIndex > -1
        ? [...fieldValues.toSpliced(newIndex, 1), fieldValues[newIndex]]
        : fieldValues
    const index = updatedFieldValues.indexOf('Ending Soon')
    if (index > -1) {
        updatedFieldValues.push(updatedFieldValues.splice(index, 1)[0])
    }

    if (updatedFieldValues.length) return (
        <div style={{
            padding: '16px 8px', marginBottom: 12
        }}>
            <div style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: 6, width: '100%', textAlign: 'center'}}>
                {filterField.label.toUpperCase()}
            </div>
            <div style={{
                display: 'flex', flexDirection: 'row', gap: 12,
                justifyContent: 'center', padding: 0, flexWrap: 'wrap'
            }}>
                {updatedFieldValues.map((val, i) =>
                    <FilterChip key={i} value={val} field={field} mode={'div'} style={styles[val]}/>
                )}
            </div>
        </div>

    )
}
