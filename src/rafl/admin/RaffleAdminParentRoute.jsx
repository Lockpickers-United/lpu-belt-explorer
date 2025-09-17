import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleAdminDBProvider} from './RaffleAdminDBContext.jsx'
import RaffleAdminDataProvider from './RaffleAdminDataProvider.jsx'

export default function RaffleAdminParentRoute() {

    console.log('RaffleAdminParentRoute')

    return (
        <RaffleAdminDBProvider>
                <Outlet/>
        </RaffleAdminDBProvider>
    )
}
