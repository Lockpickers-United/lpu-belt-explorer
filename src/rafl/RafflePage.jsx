import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../context/DataContext.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'
import FilterContext from '../context/FilterContext.jsx'
import RaffleEntry from './RaffleEntry.jsx'
import RaffleSearchBar from './RaffleSearchBar.jsx'
import {raffleSortFields} from '../data/sortFields'
import RaffleIntroBar from './RaffleIntroBar.jsx'

function RafflePage({profile}) {
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries} = useContext(DataContext)

    const defExpanded = useDeferredValue(expanded)
    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    return (

        <div style={{paddingBottom: 32}}>

            <RaffleIntroBar/>

            <RaffleSearchBar label='Raffle Pots' sortValues={raffleSortFields}/>

            <InlineFilterDisplay profile={profile} collectionType={'raffle'}/>

            {visibleEntries.length === 0 && <NoEntriesCard label='Rafl Pots'/>}

            {visibleEntries.map(entry =>
                <RaffleEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded}
                />
            )}

        </div>
    )
}

export default RafflePage
