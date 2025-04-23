import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../context/DataContext'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import NoEntriesCard from '../locks/NoEntriesCard'
import SafelockEntry from './SafelockEntry.jsx'
import FilterContext from '../context/FilterContext'
function SafelocksPage({profile}) {
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries, expandAll} = useContext(DataContext)

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    return (

        <div style={{margin: 8, paddingBottom: 32}}>

            <InlineFilterDisplay profile={profile} collectionType={'safelocks'}/>

            {visibleEntries.length === 0 && <NoEntriesCard label='Dials'/>}

            {visibleEntries.map(entry =>
                <SafelockEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded || !!expandAll}
                />
            )}
        </div>
    )
}

export default SafelocksPage
