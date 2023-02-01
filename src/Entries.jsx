import React, {useDeferredValue, useMemo} from 'react'
import Entry from './Entry.jsx'
import fuzzysort from 'fuzzysort'

function Entries({data, belt, query, searchTerm}) {
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

    const visibleEntries = useMemo(() => {
        const filtered = data
            .filter(datum => belt === 'search' || datum.belt.startsWith(belt))
            .filter(datum => {
                return filters.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
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
        <div style={{marginTop: 8, paddingBottom: 128}}>
            {visibleEntries.map(datum =>
                <Entry
                    key={datum.id}
                    entry={datum}
                    expanded={expanded === datum.id}
                    onAccordionChange={setExpanded}
                />
            )}
        </div>
    )
}

const fuzzySortKeys = [
    'fuzzy',
    'version',
    'notes'
]

export default Entries
