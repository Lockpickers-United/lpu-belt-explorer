import React, {useContext} from 'react'
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
import RaffleContext from './RaffleContext.jsx'

function RaffleCharitiesRoute() {
    const {isMobile} = useWindowSize()
    const {charityStats} = useContext(RaffleContext)

    usePageTitle('RAFL Charities')
    const extras = null

    const raflCharitiesMapped = raflCharities.map(entry => {
        const entryStats = charityStats?.find(stat => stat.id === entry.id)
        return {
            ...entry,
            donations2025: entryStats ? entryStats?.donations2025 : '--'
        }
    })

    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleCharitiesProvider allEntries={raflCharitiesMapped}>

                <div style={style}>

                    <Nav title='RAFL Charities' extras={extras}/>

                    <RaffleHeader page={'charities'}/>

                    <RaffleCharitiesPage/>

                    <Footer/>

                    <Tracker feature='raflCharities'/>
                </div>
            </RaffleCharitiesProvider>
        </FilterProvider>
)
}

export default RaffleCharitiesRoute
