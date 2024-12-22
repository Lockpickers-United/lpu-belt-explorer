import React, {useContext} from 'react'
import {FilterProvider} from '../context/FilterContext.jsx'
import {raffleFilterFields} from '../data/filterFields'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import ReportButton from './ReportButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import AdminRoleButton from './AdminRoleButton.jsx'
import RaffleDataProvider from './RaffleDataProvider.jsx'
import RaffleContext from './RaffleContext.jsx'
import RaffleHeader from './RaffleHeader.jsx'
import RaffleStats from './RaffleStats.jsx'
import RaffleSubHead from './RaffleSubHead.jsx'

function RaffleReportRoute() {
    const {isMobile} = useWindowSize()
    const {allPots} = useContext(RaffleContext)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <ReportButton active={true}/>
            <AdminRoleButton/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={allPots}>
                <React.Fragment>
                    <Nav title='RAFL Stats' extras={extras}/>
                    <RaffleHeader page={'stats'}/>
                    <RaffleSubHead text={'Stats!'}/>

                    <RaffleStats/>

                    <Footer/>

                    <Tracker feature='raflStats'/>

                </React.Fragment>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleReportRoute
