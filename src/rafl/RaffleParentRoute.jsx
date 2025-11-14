import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleProvider} from './RaffleContext.jsx'
import RaffleSetupDialog from './RaffleSetupDialog.jsx'
import {DBProviderRaffle} from './DBContextRaffle.jsx'
import RaffleStatusLog from './RaffleStatusLog.jsx'

function RaffleParentRoute() {
    return (
        <DBProviderRaffle>
            <RaffleProvider>
                <Outlet/>
                <RaffleSetupDialog/>
                <RaffleStatusLog/>
            </RaffleProvider>
        </DBProviderRaffle>
    )
}

export default RaffleParentRoute
