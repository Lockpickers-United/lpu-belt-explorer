import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../context/DataContext.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'
import FilterContext from '../context/FilterContext.jsx'

function RaffleCharitesPage() {
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries} = useContext(DataContext)

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    return (

        <div style={{margin: 8, paddingBottom: 32}}>
            <div style={{height:8}}/>

            {visibleEntries.length === 0 && <NoEntriesCard label='Charities'/>}

            {visibleEntries.map((charity, index) =>
                <div key={index}>{charity.name}</div>
            )}

        </div>
    )
}

export default RaffleCharitesPage
