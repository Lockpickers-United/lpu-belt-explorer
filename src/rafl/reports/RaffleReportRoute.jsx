import React, {useContext} from 'react'
import AuthContext from '../../app/AuthContext'
import DBContext from '../../app/DBContext'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import RaffleReport from './RaffleReport.jsx'
import ReportButton from '../ReportButton.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'

function RaffleReportRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {adminRole} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <ReportButton active={true}/>
        </React.Fragment>
    )


    return (
        <React.Fragment>
            <Nav title='RAFL Report' extras={extras}/>
            {authLoaded && adminRole && <RaffleReport/>}
            <Footer/>

            <Tracker feature='raflReport'/>
        </React.Fragment>
    )
}

export default RaffleReportRoute
