import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import Leaderboard from '../leaderboard/Leaderboard'

function LeaderboardRoute() {
    return (
        <React.Fragment>
            <Nav/>

            <Leaderboard/>

            <Footer/>
        </React.Fragment>
    )
}

export default LeaderboardRoute
