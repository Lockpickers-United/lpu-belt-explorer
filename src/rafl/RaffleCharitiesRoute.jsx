import React from 'react'
import Tracker from '../app/Tracker'
import {raffleFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleCharitiesProvider from './RaffleCharitiesProvider.jsx'
import RaffleCharitiesPage from './RaffleCharitiesPage.jsx'
import raflCharities from '../data/raflCharities.json'
import RaffleHeader from './RaffleHeader.jsx'

function RaffleCharitiesRoute() {
    const {isMobile} = useWindowSize()

    usePageTitle('RAFL')

    const extras = (
        <React.Fragment>
            <SearchBox label='Charities'/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const spacer = !isMobile ? 0 : 8
    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleCharitiesProvider allEntries={raflCharities}>

                <Nav title='RAFL Charities' extras={extras}/>
                <div style={{height:spacer}}/>
                <RaffleHeader page={'charities'}/>

                <div style={{
                    maxWidth: 700, padding: 0,
                    marginLeft: 'auto', marginRight: 'auto', marginTop: 16
                }}>
                    <RaffleCharitiesPage/>
                </div>
                <Footer/>

                <Tracker feature='raflCharities'/>
            </RaffleCharitiesProvider>
        </FilterProvider>
    )
}

export default RaffleCharitiesRoute
