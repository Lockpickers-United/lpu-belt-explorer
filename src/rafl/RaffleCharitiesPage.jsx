import React, {useContext} from 'react'
import DataContext from '../context/DataContext.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'

function RaffleCharitesPage() {
    const {visibleEntries} = useContext(DataContext)

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
