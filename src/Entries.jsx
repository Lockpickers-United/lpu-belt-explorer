import React, {useDeferredValue, useMemo} from 'react'
import Entry from './Entry.jsx'
import fuzzysort from 'fuzzysort'

function Entries({betaUser, data, belt, query, searchTerm}) {
    const [expanded, setExpanded] = React.useState(-1)
    const deferredQuery = useDeferredValue(query)
    const deferredSearchTerm = useDeferredValue(searchTerm)

    const visibleEntries = useMemo(() => {
        // Filters
        const filtered = data
            .filter(datum => belt === 'search' || datum.belt.startsWith(belt))
            .filter(datum => {
                return Object.keys(deferredQuery)
                    .every(term => {
                        const filterValue = deferredQuery[term]
                        if (Array.isArray(filterValue)) {
                            if (Array.isArray(datum[term])) {
                                return filterValue.some(filterSubValue => datum[term].includes(filterSubValue))
                            } else {
                                return filterValue.includes(datum[term])
                            }
                        } else {
                            if (Array.isArray(datum[term])) {
                                return datum[term].includes(filterValue)
                            } else {
                                return datum[term] === filterValue
                            }
                        }
                    })
            })

        // Search Term fuzzy match
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
