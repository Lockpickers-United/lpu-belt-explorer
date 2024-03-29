import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import Leaderboard from './Leaderboard'
import LeaderboardFindMeButton from './LeaderboardFindMeButton'
import LeaderboardSearchBox from './LeaderboardSearchBox'
import LeaderboardSortButton from './LeaderboardSortButton'
import {
    leaderboardData
} from '../data/dataUrls'

function LeaderboardRoute() {
    const {isMobile} = useWindowSize()
    const {data, loading, error} = useData({url})
    usePageTitle('Leaderboard')

    const nav = (
        <React.Fragment>
            <LeaderboardSearchBox data={data}/>
            <LeaderboardSortButton/>
            <LeaderboardFindMeButton/>
            {!isMobile && <div style={{flexGrow: 1}}/>}
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Leaderboard'

    return (
        <React.Fragment>
            <Nav title={title} extras={nav}/>

            {!loading && !error && data && <Leaderboard data={data} loading={loading}/>}
            {loading && <LoadingDisplay/>}

            <Footer/>

            <Tracker feature='leaderboard'/>
        </React.Fragment>
    )
}

const url = leaderboardData

export default LeaderboardRoute
