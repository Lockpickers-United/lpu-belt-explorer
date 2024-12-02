import React, {useContext} from 'react'
import AuthContext from '../../app/AuthContext'
import DBContext from '../../app/DBContext'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import RaffleReport from './RaffleReport.jsx'

function RaffleReportRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {adminRole} = useContext(DBContext)

    return (
        <React.Fragment>
            <Nav title='RAFL Report'/>

            {authLoaded && adminRole && <RaffleReport/>}

            <Footer/>

            <Tracker feature='raflReport'/>
        </React.Fragment>
    )
}

export default RaffleReportRoute
