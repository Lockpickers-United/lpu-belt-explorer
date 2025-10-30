import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../../context/DataContext.jsx'
import InlineFilterDisplay from '../../filters/InlineFilterDisplay.jsx'
import NoEntriesCard from '../../locks/NoEntriesCard.jsx'
import FilterContext from '../../context/FilterContext.jsx'
import RaffleSearchBar from '../RaffleSearchBar.jsx'
import {raffleAdminSortFields} from '../../data/sortFields'
import RaffleAdminExportButton from './RaffleAdminExportButton.jsx'
import RaffleSubmittedEntry from './RaffleSubmittedEntry.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'

function RaffleSubmittedEntriesList({editEntryId, setEditEntryId}) {
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries, expandAll} = useContext(DataContext)
    usePageTitle('RAFL Admin - Submitted Entries')

    const defExpanded = useDeferredValue(expanded)
    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: '12px 12px 12px 12px'}

    return (

        <div style={{paddingBottom: 32}}>
            <div style={{...style, paddingBottom:0, backgroundColor: '#333'}}>
                <div style={{padding: '4px 4px 4px 4px'}}>
                    <div style={{fontSize: '1.2rem', fontWeight: 500, marginTop: 1, marginBottom: 0}}>
                        Submitted RAFL Entries
                    </div>
                </div>
            </div>

            <RaffleSearchBar label='Raffle Entries' sortValues={raffleAdminSortFields} entryCount={visibleEntries.length}/>

            <InlineFilterDisplay collectionType={'raffle'}/>

            {visibleEntries.length === 0 && <NoEntriesCard label='Rafl Entries'/>}

            {visibleEntries.map(entry =>
                <RaffleSubmittedEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded || !!expandAll}
                    editId={editEntryId}
                    setEditEntryId={setEditEntryId}
                />
            )}

            <div style={{marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', justifyItems: 'center', marginTop: 30}}>
                <RaffleAdminExportButton text={true}/>
            </div>

        </div>
    )
}

export default RaffleSubmittedEntriesList
