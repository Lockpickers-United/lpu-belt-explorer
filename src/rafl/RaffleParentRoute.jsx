import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleProvider} from './RaffleContext.jsx'
import RaffleSetupDialog from './RaffleSetupDialog.jsx'
import {DBProviderRaffle} from './DBContextRaffle.jsx'

function RaffleParentRoute() {

    console.log('RaffleParentRoute')

    return (
        <DBProviderRaffle>
            <RaffleProvider>
                <Outlet/>
                <RaffleSetupDialog/>
            </RaffleProvider>
        </DBProviderRaffle>
    )
}

export default RaffleParentRoute
