import React, {useContext} from 'react'
import {FilterProvider} from '../context/FilterContext.jsx'
import {raffleFilterFields} from '../data/filterFields'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import useWindowSize from '../util/useWindowSize.jsx'
import AdminToolsButton from './AdminToolsButton.jsx'
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
            <AdminToolsButton/>
        </React.Fragment>
    )

    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={allPots}>
                <div style={style}>

                    <Nav title='RAFL Stats' extras={extras}/>
                    <RaffleHeader page={'stats'}/>
                    <RaffleSubHead text={'Stats!'}/>

                    <RaffleStats/>

                    <Footer/>

                    <Tracker feature='raflStats'/>

                </div>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleReportRoute
