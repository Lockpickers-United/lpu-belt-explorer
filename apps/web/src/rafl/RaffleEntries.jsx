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
import ExposedFilterSelect from './ExposedFilterSelect.jsx'
import {Collapse} from '@mui/material'
import RaffleBonusBar from './RaffleBonusBar.jsx'

function RaffleEntries({drawing = false}) {
    const {visibleEntries = [], expandAll, allEntries} = useContext(DataContext)
    const {filters, showAdvancedSearch} = useContext(FilterContext)
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

            <div id='raffleSearchBar' style={{scrollMarginTop: 72}}/>
            <RaffleSearchBar label='Raffle Pots' sortValues={raffleSortFields} entryCount={visibleEntries.length}/>

            <Collapse in={!showAdvancedSearch}>
                <ExposedFilterSelect
                    field={'category'}
                    sequence={['Locks', 'Gift certificates', 'Picks']}
                    styles={{
                        'New': {color: '#42b232', border: '1px solid #42b232'},
                        'Ending Soon': {color: '#f54040', border: '1px solid #f54040'}
                    }}
                />
            </Collapse>

            <AdvancedFilters entryType={'Pot'}/>

            <RaffleBonusBar />

            {(shippingType === 'Intl. shipping included' || splitShipping === 'shippingSplit') &&
                <div style={{margin: '18px 12px', fontSize: '0.9rem', color: '#eee'}}>
                    <strong>Please note:</strong> some of the pots below are offered with
                    international shipping included but US winners will
                    need to pay for any additional tariffs and fees.
                </div>
            }

            {allEntries.length && visibleEntries.length === 0 && <NoEntriesCard label='Rafl Pots'/>}

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
