import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleProvider} from './RaffleContext.jsx'
import RaffleSetupDialog from './RaffleSetupDialog.jsx'

function RaffleParentRoute() {


    return (
        <RaffleProvider>
            <Outlet/>
            <RaffleSetupDialog/>
        </RaffleProvider>
    )
}

export default RaffleParentRoute
