import React, {useContext} from 'react'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {raffleFilterFields} from '../../data/filterFields'
import AuthContext from '../../app/AuthContext'
import DBContext from '../../app/DBContext'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import RaffleReport from './RaffleReport.jsx'
import ReportButton from '../ReportButton.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminRoleButton from '../AdminRoleButton.jsx'
import RaffleDataProvider from '../RaffleDataProvider.jsx'
import RaffleContext from '../RaffleContext.jsx'

function RaffleReportRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {isMobile} = useWindowSize()
    const {allPots} = useContext(RaffleContext)
    const {raffleAdmin} = useContext(RaffleContext)

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
                    <Nav title='RAFL Report' extras={extras}/>
                    {authLoaded && raffleAdmin && <RaffleReport/>}
                    <Footer/>

                    <Tracker feature='raflReport'/>
                </React.Fragment>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleReportRoute
