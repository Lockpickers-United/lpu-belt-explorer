import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../context/DataContext.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'
import FilterContext from '../context/FilterContext.jsx'
import RaffleEntry from './RaffleEntry.jsx'
import RaffleSearchBar from './RaffleSearchBar.jsx'
import {raffleSortFields} from '../data/sortFields'
import RaffleIntroBar from './RaffleIntroBar.jsx'
import RaffleExportButton from './RaffleExportButton.jsx'
import ExpandAllButton from './ExpandAllButton.jsx'

function RaffleEntries({profile, allPots, drawing = false}) {
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries, expandAll} = useContext(DataContext)

    const activeEntries = allPots || visibleEntries || []

    console.log('activeEntries', activeEntries)
    const defExpanded = useDeferredValue(expanded)
    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    return (

        <div style={{paddingBottom: 32}}>
            {!drawing &&
                <RaffleIntroBar/>
            }

            <RaffleSearchBar label='Raffle Pots' sortValues={raffleSortFields}/>

            <InlineFilterDisplay profile={profile} collectionType={'raffle'}/>

            <div style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                justifyItems: 'center',
                marginTop: 4,
                marginBottom: 4
            }}>
                <ExpandAllButton/>
            </div>

            {activeEntries.length === 0 && <NoEntriesCard label='Rafl Pots'/>}

            {activeEntries.map(entry =>
                <RaffleEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded || !!expandAll}
                    drawing={drawing}
                />
            )}

            <div style={{marginLeft: 'auto', marginRight: 'auto', justifyItems: 'center', marginTop: 30}}>
                <RaffleExportButton text={true}/>
            </div>

        </div>
    )
}

export default RaffleEntries
