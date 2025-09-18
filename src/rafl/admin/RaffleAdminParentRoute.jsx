import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleAdminDBProvider} from './RaffleAdminDBContext.jsx'
import RaffleAdminDataProviderEntries from './RaffleAdminDataProviderEntries.jsx'

export default function RaffleAdminParentRoute() {

    console.log('RaffleAdminParentRoute')

    return (
        <RaffleAdminDBProvider>
                <Outlet/>
        </RaffleAdminDBProvider>
    )
}
