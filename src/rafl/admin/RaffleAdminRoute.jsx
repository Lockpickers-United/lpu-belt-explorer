import React, {useContext} from 'react'
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
import RaffleSubmittedEntriesList from './RaffleSubmittedEntriesList.jsx'
import {RaffleAdminDBProvider} from './RaffleAdminDBContext.jsx'

function RaffleAdminRoute() {
    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const {isMobile} = useWindowSize()
    const {raffleAdmin} = useContext(RaffleContext)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolsButton/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleEntryFilterFields}>
            <RaffleAdminDBProvider>
                <RaffleAdminDataProvider>
                    <React.Fragment>
                        <Nav title='RAFL Admin' extras={extras}/>
                        {raffleAdmin
                            ? <RaffleSubmittedEntriesList/>
                            : <div>Unauthorized</div>
                        }
                        <Footer/>

                        <Tracker feature='raflAdmin'/>
                    </React.Fragment>
                </RaffleAdminDataProvider>
            </RaffleAdminDBProvider>
        </FilterProvider>
    )
}

export default RaffleAdminRoute
