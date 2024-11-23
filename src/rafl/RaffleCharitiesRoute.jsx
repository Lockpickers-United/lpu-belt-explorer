import React from 'react'
import Tracker from '../app/Tracker'
import {raffleFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleCharitiesProvider from './RaffleCharitiesProvider.jsx'
import RaffleCharitiesPage from './RaffleCharitiesPage.jsx'
import raflCharities from '../data/raflCharities.json'
import RaffleHeader from './RaffleHeader.jsx'
import useData from '../util/useData.jsx'
import {raflStats} from '../data/dataUrls'

function RaffleCharitiesRoute() {
    const {isMobile} = useWindowSize()

    usePageTitle('RAFL')
    const extras = (
        <React.Fragment>
        </React.Fragment>
    )

    const {data, loading, error} = useData({url: raflStats})
    const dataReady = (data && !loading && !error)

    const raflCharitiesMapped = raflCharities.map(entry => {
        const entryStats = data?.charityStats.find(stat => stat.id === entry.id)
        return {
            ...entry,
            donations2025: dataReady ? entryStats?.donations2025 : '--'
        }
    })

    const spacer = !isMobile ? 0 : 8
    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleCharitiesProvider allEntries={raflCharitiesMapped}>

                <Nav title='RAFL Charities' extras={extras}/>

                <div style={{height:spacer}}/>
                <RaffleHeader page={'charities'}/>

                <RaffleCharitiesPage/>

                <Footer/>

                <Tracker feature='raflCharities'/>
            </RaffleCharitiesProvider>
        </FilterProvider>
    )
}

export default RaffleCharitiesRoute
