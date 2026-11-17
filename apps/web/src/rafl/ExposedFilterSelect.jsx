import React, {useContext} from 'react'
import FilterChip from '../filters/FilterChip.jsx'
import FilterContext from '../context/FilterContext.jsx'
import DataContext from '../context/DataContext.jsx'

export default function ExposedFilterSelect({field = 'category'}) {

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
    const fieldValues = Object.keys(values).sort((a, b) => values[b] - values[a])

    return (
        <div style={{
            padding: '16px 8px', marginBottom: 12
        }}>
            <div style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: 6, width: '100%', textAlign: 'center'}}>
                {filterField.label.toUpperCase()}</div>
            <div style={{
                display: 'flex', flexDirection: 'row', gap: 12,
                justifyContent: 'center', padding: 0, flexWrap: 'wrap'
            }}>
                {fieldValues.map((val, i) => <FilterChip key={i} value={val} field={field} mode={'div'}/>)}
            </div>
        </div>

    )
}