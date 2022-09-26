import React, {useDeferredValue, useMemo} from 'react'
import Belt from './Belt.jsx'
import fuzzysort from 'fuzzysort'

import data from './data'

function Belts({query, searchTerm}) {
    const [expanded, setExpanded] = React.useState(-1)
    const deferredQuery = useDeferredValue(query)
    const deferredSearchTerm = useDeferredValue(searchTerm)

    const filters = useMemo(() => {
        return Object.keys(deferredQuery)
            .map(key => {
                const value = deferredQuery[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()
    }, [deferredQuery])

    const visibleBelts = useMemo(() => {
        const filtered = data.filter(belt => {
            return filters.every(({key, value}) => {
                return Array.isArray(belt[key])
                    ? belt[key].includes(value)
                    : belt[key] === value
            })
        })
        if (deferredSearchTerm) {
            const fuzzyResults = fuzzysort.go(deferredSearchTerm, filtered, {keys: fuzzySortKeys})
            return fuzzyResults.map(result => result.obj)
        } else {
            return filtered
        }
    }, [filters, deferredSearchTerm])

    return (
        <div style={{paddingTop: 64, margin: 8, maxWidth: 700}}>
            {visibleBelts.map((datum, index) =>
                <Belt
                    key={index}
                    index={index}
                    belt={datum}
                    expanded={expanded === index}
                    onAccordionChange={setExpanded}
                />
            )}
        </div>
    )
}

const fuzzySortKeys = ['makeModel', 'notes', 'tags']

export default Belts
