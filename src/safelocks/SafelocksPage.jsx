import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import DataContext from '../context/DataContext'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import NoEntriesCard from '../locks/NoEntriesCard'
import SafelockEntry from './SafelockEntry.jsx'

function SafelocksPage({profile}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [expanded, setExpanded] = useState(searchParams.get('id'))
    const {allEntries, visibleEntries} = useContext(DataContext)

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        const entry = allEntries.find(dial => dial.id === id)
        if (entry) {
            const name = (entry.make && entry.model) ? `${entry.make} ${entry.model}` : entry.model
            searchParams.set('id', id)
            searchParams.set('name', name)
            setSearchParams(searchParams)
        }
        setExpanded(id)
    }, [allEntries, searchParams, setSearchParams])

    return (
        <div style={{margin: 8, paddingBottom: 32}}>
            <InlineFilterDisplay profile={profile} collectionType={'safelocks'}/>

            {visibleEntries.length === 0 && <NoEntriesCard label='Dials'/>}

            {visibleEntries.map(entry =>
                <SafelockEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded}
                />
            )}
        </div>
    )
}

export default SafelocksPage
