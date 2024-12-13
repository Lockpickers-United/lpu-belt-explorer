import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleProvider} from './RaffleContext.jsx'

function RaffleParentRoute() {
    return (
        <RaffleProvider>
            <Outlet/>
        </RaffleProvider>
    )
}

export default RaffleParentRoute
