import React, {useContext} from 'react'
import Tracker from '../../app/Tracker.jsx'
import {raffleFilterFields} from '../../data/filterFields'
import {FilterProvider} from '../../context/FilterContext.jsx'
import Footer from '../../nav/Footer.jsx'
import Nav from '../../nav/Nav.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import RaffleCharitiesProvider from '../RaffleCharitiesProvider.jsx'
import raflCharities from '../../data/raflCharities.json'
import RaffleHeader from '../RaffleHeader.jsx'
import RaffleStatsContext from '../RaffleStatsContext.jsx'
import RaffleEntryForm from './RaffleEntryForm.jsx'

function RaffleEntryFormRoute() {
    const {isMobile} = useWindowSize()
    const {charityStats} = useContext(RaffleStatsContext)

    usePageTitle('RAFL Entry Form')
    const extras = null

    const raflCharitiesMapped = raflCharities.map(entry => {
        const entryStats = charityStats?.find(stat => stat.id === entry.id)
        return {
            ...entry,
            donations2025: entryStats ? entryStats?.donations2025 : '--'
        }
    })

    const spacer = !isMobile ? 0 : 8
    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleCharitiesProvider allEntries={raflCharitiesMapped}>

                <Nav title='RAFL Entry Form' extras={extras}/>

                <div style={{height:spacer}}/>
                <RaffleHeader page={'entryform'}/>

                <RaffleEntryForm/>

                <Footer/>

                <Tracker feature='raflCharities'/>
            </RaffleCharitiesProvider>
        </FilterProvider>
    )
}

export default RaffleEntryFormRoute
