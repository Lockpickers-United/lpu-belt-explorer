import React, {useDeferredValue, useMemo} from 'react'
import Entry from './Entry.jsx'
import fuzzysort from 'fuzzysort'

function Entries({betaUser, data, belt, query, searchTerm}) {
    const [expanded, setExpanded] = React.useState(-1)
    const deferredQuery = useDeferredValue(query)
    const deferredSearchTerm = useDeferredValue(searchTerm)

    const visibleEntries = useMemo(() => {
        // Filters as an array
        const filters = Object.keys(deferredQuery)
            .map(key => {
                const value = deferredQuery[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()

        // Filter the data
        const filtered = data
            .filter(datum => belt === 'search' || datum.belt.startsWith(belt))
            .filter(datum => {
                return filters.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })

        // If there is a search term, fuzzy match that
        if (deferredSearchTerm) {
            const fuzzyResults = fuzzysort.go(deferredSearchTerm, filtered, {keys: fuzzySortKeys})
            return fuzzyResults.map(result => result.obj)
        } else {
            return filtered
        }
    }, [deferredQuery, deferredSearchTerm])

    return (
        <div style={{marginTop: 8, paddingBottom: 128}}>
            {visibleEntries.map(datum =>
                <Entry
                    key={datum.id}
                    betaUser={betaUser}
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
