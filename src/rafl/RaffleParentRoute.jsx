import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleProvider} from './RaffleContext.jsx'
import RaffleSetupDialog from './RaffleSetupDialog.jsx'
import {DBProviderRaffle} from './DBContextRaffle.jsx'

function RaffleParentRoute() {


    return (
        <RaffleProvider>
            <DBProviderRaffle>
                <Outlet/>
                <RaffleSetupDialog/>
            </DBProviderRaffle>
        </RaffleProvider>
    )
}

export default RaffleParentRoute
