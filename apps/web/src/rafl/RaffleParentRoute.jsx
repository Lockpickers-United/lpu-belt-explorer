import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleProvider} from './RaffleContext.jsx'
import RaffleSetupDialog from './RaffleSetupDialog.jsx'
import {DBProviderRaffle} from './DBContextRaffle.jsx'
import {ProfileProvider} from '../app/ProfileContext.jsx'

function RaffleParentRoute() {
    return (
        <ProfileProvider>
            <DBProviderRaffle>
                <RaffleProvider>
                    <Outlet/>
                    <RaffleSetupDialog/>
                </RaffleProvider>
            </DBProviderRaffle>
        </ProfileProvider>
    )
}

export default RaffleParentRoute
