import React, {useCallback, useContext, useDeferredValue, useMemo, useState} from 'react'
import Entry from './Entry.jsx'
import fuzzysort from 'fuzzysort'
import FilterContext from './FilterContext.jsx'
import InlineFilterDisplay from './InlineFilterDisplay.jsx'
import StorageContext from './StorageContext.jsx'
import BeltRequirements from './BeltRequirements.jsx'

function Entries({data, tab, onChangeTab}) {
    const {filters, removeFilter} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {starredEntries} = useContext(StorageContext)

    const {search, id, ...otherFilters} = filters
    const defTab = useDeferredValue(tab)
    const defSearch = useDeferredValue(search)
    const defFilters = useDeferredValue(otherFilters)
    const defStarredEntries = useDeferredValue(starredEntries)

    const handleExpand = useCallback(value => {
        if (id && value && value !== id) {
            removeFilter('id')
        }
        setExpanded(value)
    }, [id, removeFilter])

    const visibleEntries = useMemo(() => {
        // Filters as an array
        const filterArray = Object.keys(defFilters)
            .map(key => {
                const value = defFilters[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()

        // Filter the data
        const filtered = data
            .map(entry => {
                entry.starred = `${defStarredEntries.includes(entry.id)}`
                return entry
            })
            .filter(datum => {
                const isRightTab = defTab === 'search' || datum.belt.startsWith(defTab)
                if (!isRightTab) return false

                return !isRightTab || filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })

        // If there is a search term, fuzzy match that
        return defSearch
            ? fuzzysort.go(defSearch, filtered, {keys: fuzzySortKeys}).map(result => result.obj)
            : filtered
    }, [data, defFilters, defSearch, defTab, defStarredEntries])

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>
                <InlineFilterDisplay tab={tab} onChangeTab={onChangeTab}/>
                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}

                {visibleEntries.map(datum =>
                    <Entry
                        key={datum.id}
                        entry={datum}
                        expanded={expanded === datum.id}
                        onAccordionChange={handleExpand}
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
