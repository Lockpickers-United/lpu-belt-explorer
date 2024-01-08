import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import Leaderboard from './Leaderboard'

function LeaderboardRoute() {
    return (
        <React.Fragment>
            <Nav title='Collection Leaderboard'/>

            <Leaderboard/>

            <Footer/>

            <Tracker feature='leaderboard'/>
        </React.Fragment>
    )
}

export default LeaderboardRoute
