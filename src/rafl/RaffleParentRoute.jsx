import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleStatsProvider} from './RaffleContext.jsx'

function RaffleParentRoute() {
    return (
        <RaffleStatsProvider>
            <Outlet/>
        </RaffleStatsProvider>
    )
}

export default RaffleParentRoute
