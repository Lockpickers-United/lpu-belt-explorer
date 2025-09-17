import React, {useContext, useEffect, useMemo, useState} from 'react'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {raffleEntryFilterFields} from '../../data/filterFields'
import AuthContext from '../../app/AuthContext'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminToolsButton from '../AdminToolsButton.jsx'
import RaffleAdminDataProvider from './RaffleAdminDataProvider.jsx'
import RaffleContext from '../RaffleContext.jsx'
import {RaffleAdminDBProvider} from './RaffleAdminDBContext.jsx'
import RaffleHeaderDrawing from './RaffleHeaderDrawing.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import SignInButton from '../../auth/SignInButton.jsx'
import RandomLockGrid from './RandomLockGrid.jsx'
import RaffleDrawingFunctions from './RaffleDrawingFunctions.jsx'
import RaffleDrawingEntries from './RaffleDrawingEntries.jsx'

function RaffleAdminRoute() {
    const {raffleAdmin, setRaffleAdminRole} = useContext(RaffleContext)
    const {authLoaded, isLoggedIn, user, lockCollection} = useContext(AuthContext)

    useEffect(() => {
        if (raffleAdmin) setRaffleAdminRole(true)
    })

    const {isMobile} = useWindowSize()

    const [editEntryId, setEditEntryId] = useState(null)

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
            <RaffleHeaderDrawing page={'drawing'}/>
            <div style={{padding: 20}}>
                {!isLoggedIn && <div>Please log in to access this page.</div>}
                {isLoggedIn && !raffleAdmin && <div>Sorry, you do not have access to this page.</div>}
                <div><SignInButton/></div>
            </div>
            <Footer/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleEntryFilterFields}>
            <RaffleAdminDBProvider>
                <RaffleAdminDataProvider>
                    <React.Fragment>
                        <Nav title='RAFL Admin' extras={extras}/>
                        <RaffleHeaderDrawing page={'drawing'}/>

                        <RaffleDrawingFunctions />

                        {raffleAdmin && !editEntryId &&
                            <RaffleDrawingEntries/>
                        }

                        <div style={{maxWidth: 800, margin: '0 auto'}}>
                            <RandomLockGrid/>
                        </div>

                        <Footer/>

                        <Tracker feature='raflAdmin'/>
                    </React.Fragment>
                </RaffleAdminDataProvider>
            </RaffleAdminDBProvider>
        </FilterProvider>
    )
}

export default RaffleAdminRoute
