import React, {useContext, useEffect} from 'react'
import AuthContext from '../../app/AuthContext'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminToolsButton from '../AdminToolsButton.jsx'
import RaffleContext from '../RaffleContext.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import SignInButton from '../../auth/SignInButton.jsx'
import RaffleDrawingEntries from './RaffleDrawingEntries.jsx'
import {raffleFilterFields} from '../../data/filterFields'
import {FilterProvider} from '../../context/FilterContext.jsx'
import RaffleAdminDataProviderPots from './RaffleAdminDataProviderPots.jsx'
import RaffleHeader from '../RaffleHeader.jsx'

export default function RaffleDrawingRoute() {
    const {raffleAdmin, setRaffleAdminRole} = useContext(RaffleContext)
    const {authLoaded, isLoggedIn} = useContext(AuthContext)

    useEffect(() => {
        if (raffleAdmin) setRaffleAdminRole(true)
    })

    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolsButton/>
        </React.Fragment>
    )

    if (!authLoaded) return (<LoadingDisplay message='Loading...'/>)
    if (authLoaded && !raffleAdmin) return (
        <React.Fragment>
            <Nav title='RAFL Admin' extras={extras}/>
            <RaffleHeader page={'drawing'}/>
            <div style={{padding: 20}}>
                {!isLoggedIn && <div>Please log in to access this page.</div>}
                {isLoggedIn && !raffleAdmin && <div>Sorry, you do not have access to this page.</div>}
                <div><SignInButton/></div>
            </div>
            <Footer/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleAdminDataProviderPots drawing={true}>
                <Nav title='RAFL Drawing' extras={extras}/>
                <RaffleHeader page={'drawing'}/>

                {raffleAdmin &&
                    <RaffleDrawingEntries/>
                }

                <Footer/>

                <Tracker feature='raflAdmin'/>
            </RaffleAdminDataProviderPots>
        </FilterProvider>
    )
}