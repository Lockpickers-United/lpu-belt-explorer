import React, {useContext} from 'react'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {raffleFilterFields} from '../../data/filterFields'
import AuthContext from '../../app/AuthContext'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import RaffleReport from './RaffleReport.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminToolButtons from '../AdminToolButtons.jsx'
import RaffleContext from '../RaffleContext.jsx'
import RaffleHeader from '../RaffleHeader.jsx'

function RaffleReportRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {isMobile} = useWindowSize()
    const {raffleAdmin} = useContext(RaffleContext)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolButtons/>
        </React.Fragment>
    )

    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 800,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <div style={style}>

                <Nav title='RAFL Report' extras={extras}/>
                <RaffleHeader page={'reports'} width={700}/>
                {authLoaded && raffleAdmin && <RaffleReport/>}
                <Footer/>

                <Tracker feature='raflReport'/>

            </div>
        </FilterProvider>
    )
}

export default RaffleReportRoute
