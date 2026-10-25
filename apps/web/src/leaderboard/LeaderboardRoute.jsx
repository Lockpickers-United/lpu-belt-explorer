import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import usePageTitle from '../util/usePageTitle'
import {Outlet} from 'react-router-dom'

function LeaderboardRoute() {
    usePageTitle('Leaderboard')

    return (
        <React.Fragment>
            <Outlet/>
            <Footer/>
            <Tracker feature='leaderboard'/>
        </React.Fragment>
    )
}


export default LeaderboardRoute
