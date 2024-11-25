import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleStatsProvider} from './RaffleStatsContext.jsx'

function RaffleParentRoute() {
    return (
        <RaffleStatsProvider>
            <Outlet/>
        </RaffleStatsProvider>
    )
}

export default RaffleParentRoute
