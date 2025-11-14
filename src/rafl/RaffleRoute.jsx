import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import {raffleFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleDataProvider from './RaffleDataProvider.jsx'
import RaffleEntries from './RaffleEntries.jsx'
import RaffleHeader from './RaffleHeader.jsx'
import RaffleContext from './RaffleContext.jsx'
import AdminToolsButton from './AdminToolsButton.jsx'

function RaffleRoute() {
    usePageTitle('RAFL Prizes')

    const {allPots, allCharities, raflState} = useContext(RaffleContext)
    if (!allPots || !allCharities) return null
    const allEntries = allPots

    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            <React.Fragment>
                {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
                <AdminToolsButton/>
            </React.Fragment>
        </React.Fragment>
    )
    const extrasTwo = undefined

    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }

    let navTitle = raflState === 'post'
        ? 'RAFL 2026 has ended'
        : ['live', 'setup'].includes(raflState) || !isMobile
            ? 'RAFL 2026!'
            : 'Announcing RAFL 2026!'

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={allEntries}>

                <div style={style}>
                    <Nav title={navTitle} extras={extras} extrasTwo={extrasTwo}/>
                    <RaffleHeader page={'pots'}/>

                    <RaffleEntries/>

                    <Footer/>
                    <Tracker feature='rafl'/>
                </div>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleRoute
