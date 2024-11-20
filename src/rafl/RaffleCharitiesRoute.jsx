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

function RaffleCharitiesRoute() {
    const {isMobile} = useWindowSize()

    usePageTitle('RAFL')

    const extras = (
        <React.Fragment>
            <SearchBox label='Charities'/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleCharitiesProvider allEntries={raflCharities}>

                <Nav title='RAFL!' extras={extras}/>

                <RaffleCharitiesPage/>

                <Footer/>

                <Tracker feature='raflCharities'/>
            </RaffleCharitiesProvider>
        </FilterProvider>
    )
}

export default RaffleCharitiesRoute
