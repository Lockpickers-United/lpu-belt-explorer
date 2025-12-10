import React from 'react'
import {Outlet} from 'react-router-dom'
import {RaffleAdminDBProvider} from './RaffleAdminDBContext.jsx'

export default function RaffleAdminParentRoute() {

    return (
        <RaffleAdminDBProvider>
                <Outlet/>
        </RaffleAdminDBProvider>
    )
}
