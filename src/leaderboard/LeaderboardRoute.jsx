import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import Leaderboard from './Leaderboard'

function LeaderboardRoute() {
    return (
        <React.Fragment>
            <Nav title='Collection Leaderboard'/>

            <Leaderboard/>

            <Footer/>
        </React.Fragment>
    )
}

export default LeaderboardRoute
