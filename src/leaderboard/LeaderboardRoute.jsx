import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import usePageTitle from '../util/usePageTitle'
import Leaderboard from './Leaderboard'
import {leaderboardData2} from '../data/dataUrls'

function LeaderboardRoute() {
    const {data, loading, error} = useData({url})
    usePageTitle('Leaderboard')

    return (
        <React.Fragment>

            {(!loading && !error && data) && <Leaderboard data={data} loading={loading}/>}
            {loading && <LoadingDisplay/>}

            <Footer/>

            <Tracker feature='leaderboard'/>
        </React.Fragment>
    )
}

const url = leaderboardData2

export default LeaderboardRoute
