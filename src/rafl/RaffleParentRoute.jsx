import React from 'react'
import usePageTitle from '../util/usePageTitle'
import {Outlet} from 'react-router-dom'

function RaffleParentRoute() {
    usePageTitle('RAFL')

    console.log('parent')

    return (
        <Outlet/>
    )
}

export default RaffleParentRoute
