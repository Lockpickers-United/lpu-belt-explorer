import React, {useContext, useDeferredValue, useMemo, useState} from 'react'
import Entry from './Entry.jsx'
import fuzzysort from 'fuzzysort'
import FilterContext from './FilterContext.jsx'
import InlineFilterDisplay from './InlineFilterDisplay.jsx'

function Entries({data, tab}) {
    const [expanded, setExpanded] = useState(-1)
    const {filters} = useContext(FilterContext)

    const {search, ...otherFilters} = filters
    const defTab = useDeferredValue(tab)
    const defSearch = useDeferredValue(search)
    const defFilters = useDeferredValue(filters)

    const visibleEntries = useMemo(() => {
        // Filters as an array
        const filterArray = Object.keys(otherFilters)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()

        // Filter the data
        const filtered = data
            .filter(datum => defTab === 'search' || datum.belt.startsWith(defTab))
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })

        // If there is a search term, fuzzy match that
        if (defSearch) {
            const fuzzyResults = fuzzysort.go(search, filtered, {keys: fuzzySortKeys})
            return fuzzyResults.map(result => result.obj)
        } else {
            return filtered
        }
    }, [defTab, defSearch, defFilters])

    return (
        <React.Fragment>
            <div style={{marginTop: 8, paddingBottom: 128}}>
                <InlineFilterDisplay/>

                {visibleEntries.map(datum =>
                    <Entry
                        key={datum.id}
                        entry={datum}
                        expanded={expanded === datum.id}
                        onAccordionChange={setExpanded}
                    />
                )}
            </div>

        </React.Fragment>
    )
}

const fuzzySortKeys = [
    'fuzzy',
    'version',
    'notes'
]

export default Entries
