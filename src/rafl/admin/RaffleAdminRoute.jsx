import React, {useContext, useEffect, useState} from 'react'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {raffleEntryFilterFields} from '../../data/filterFields'
import AuthContext from '../../app/AuthContext'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminToolButtons from '../AdminToolButtons.jsx'
import RaffleContext from '../RaffleContext.jsx'
import RaffleSubmittedEntriesList from './RaffleSubmittedEntriesList.jsx'
import RaffleEntryForm from '../entryForm/RaffleEntryForm.jsx'
import RaffleHeader from '../RaffleHeader.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import SignInButton from '../../auth/SignInButton.jsx'
import RaffleAdminDataProviderEntries from './RaffleAdminDataProviderEntries.jsx'

function RaffleAdminRoute() {
    const {raffleAdmin, setRaffleAdminRole} = useContext(RaffleContext)
    const {authLoaded, isLoggedIn} = useContext(AuthContext)

    useEffect(() => {
        if (raffleAdmin) setRaffleAdminRole(true)
    })

    const {isMobile} = useWindowSize()

    const [editEntryId, setEditEntryId] = useState(null)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolButtons/>
        </React.Fragment>
    )

    if (!authLoaded) return (<LoadingDisplay message='Loading...'/>)
    if (authLoaded && !raffleAdmin) return (
        <React.Fragment>
            <Nav title='RAFL Admin' extras={extras}/>
            <RaffleHeader page={'RAFL Admin'}/>
            <div style={{padding: 20}}>
                {!isLoggedIn && <div>Please log in to access this page.</div>}
                {isLoggedIn && !raffleAdmin && <div>Sorry, you do not have access to this page.</div>}
                <div><SignInButton/></div>
            </div>
            <Footer/>
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
        <FilterProvider filterFields={raffleEntryFilterFields}>
            <RaffleAdminDataProviderEntries>
                <div style={style}>

                    <Nav title='RAFL Admin' extras={extras}/>
                    <RaffleHeader page={'entries'}/>

                    {raffleAdmin && !editEntryId &&
                        <RaffleSubmittedEntriesList editEntryId={editEntryId} setEditEntryId={setEditEntryId}/>
                    }

                    {raffleAdmin && !!editEntryId &&
                        <RaffleEntryForm editEntryId={editEntryId} setEditEntryId={setEditEntryId}/>
                    }

                    <Footer/>

                    <Tracker feature='raflAdmin'/>

                </div>
            </RaffleAdminDataProviderEntries>
        </FilterProvider>
    )
}

export default RaffleAdminRoute
