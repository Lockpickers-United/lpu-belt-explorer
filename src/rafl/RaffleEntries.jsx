import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../context/DataContext.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'
import FilterContext from '../context/FilterContext.jsx'
import RaffleEntry from './RaffleEntry.jsx'
import RaffleSearchBar from './RaffleSearchBar.jsx'
import {raffleSortFields} from '../data/sortFields'
import RaffleIntroBar from './RaffleIntroBar.jsx'
import RaffleExportButton from './RaffleExportButton.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'

function RaffleEntries({drawing = false}) {
    const {visibleEntries = [], expandAll} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const {id, shippingType, splitShipping} = filters
    const [expanded, setExpanded] = useState(id)

    const defExpanded = useDeferredValue(expanded)
    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    return (

        <div style={{paddingBottom: 32}}>
            {!drawing &&
                <RaffleIntroBar/>
            }

            <RaffleSearchBar label='Raffle Pots' sortValues={raffleSortFields} entryCount={visibleEntries.length}/>
            <AdvancedFilters/>

            {(shippingType === 'Intl. shipping included' || splitShipping === 'shippingSplit') &&
                <div style={{margin: '18px 12px', fontSize: '0.9rem', color: '#eee'}}>
                    <strong>Please note:</strong> some of the pots below are offered with
                    international shipping included but US winners will
                    need to pay for any additional tariffs and fees.
                </div>
            }
            {visibleEntries.length === 0 && <NoEntriesCard label='Rafl Pots'/>}

            {visibleEntries.map(entry =>
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
