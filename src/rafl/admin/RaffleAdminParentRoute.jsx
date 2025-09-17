import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleAdminDBProvider} from './RaffleAdminDBContext.jsx'
import RaffleAdminDataProvider from './RaffleAdminDataProvider.jsx'

function RaffleParentRoute() {

    console.log('RaffleAdminParentRoute')

    return (
        <RaffleAdminDBProvider>
            <RaffleAdminDataProvider>
                <Outlet/>
            </RaffleAdminDataProvider>
        </RaffleAdminDBProvider>
    )
}

export default RaffleParentRoute
