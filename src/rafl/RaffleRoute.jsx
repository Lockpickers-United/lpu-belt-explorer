import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import DBContext from '../app/DBContext'
import {raffleFilterFields} from '../data/filterFields'
import {raffleSortFields} from '../data/sortFields'
import {FilterProvider} from '../context/FilterContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleDataProvider from './RaffleDataProvider.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import RafflePage from './RafflePage.jsx'

import raflPots from './raflData.json'

function RaffleRoute() {
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)
    usePageTitle('RAFL')

    const extras = (
        <React.Fragment>
            <SearchBox label='Raffle Pots'/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )
    const extrasTwo = (
        <React.Fragment>
            <ViewFilterButtons sortValues={raffleSortFields}/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={raflPots} profile={lockCollection}>

                <Nav title='RAFL!' extras={extras} extrasTwo={extrasTwo}/>

                <RafflePage profile={lockCollection}/>

                <Footer/>

                <Tracker feature='rafl'/>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleRoute
