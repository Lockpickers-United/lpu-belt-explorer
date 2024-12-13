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
import RaffleHeader from './RaffleHeader.jsx'
import ReportButton from './ReportButton.jsx'
import AdminRoleButton from './AdminRoleButton.jsx'
import RaffleComingSoon from './RaffleComingSoon.jsx'

function RaffleCharitiesRoute() {

    usePageTitle('RAFL Charities')

    const {isMobile} = useWindowSize()
    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <ReportButton/>
            <AdminRoleButton/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleCharitiesProvider>

                <div style={style}>

                    <Nav title='RAFL Charities' extras={extras}/>

                    <RaffleHeader page={'charities'}/>

                    <RaffleCharitiesPage/>

                    <Footer/>

                    <Tracker feature='raflCharities'/>

                    <RaffleComingSoon/>

                </div>
            </RaffleCharitiesProvider>
        </FilterProvider>
    )
}

export default RaffleCharitiesRoute
