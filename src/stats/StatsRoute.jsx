import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import StatsMainPage from './StatsMainPage'

function StatsRoute() {
    const {data, loading, error} = useData({urls})

    return (
        <React.Fragment>
            <Nav title='Stats & Insights'/>

            {!loading && !error && data && <StatsMainPage data={data}/>}
            {loading && <LoadingDisplay/>}

            <Footer/>

            <Tracker feature='stats'/>
        </React.Fragment>
    )
}

const urls = {
    brandDistribution: 'https://explore.lpubelts.com/data/statsBrandDistribution.json',
    collectionsFull: 'https://explore.lpubelts.com/data/statsCollectionsFull.json',
    collectionsSummary: 'https://explore.lpubelts.com/data/statsCollectionsSummaryTEMP.json',
    lockSummary: 'https://explore.lpubelts.com/data/statsLockSummary.json',
    popularAreas: 'https://explore.lpubelts.com/data/statsPopularAreas.json',
    redditGrowth: 'https://explore.lpubelts.com/data/statsRedditGrowth.json',
    siteSummary: 'https://explore.lpubelts.com/data/statsSiteSummary.json'
}

export default StatsRoute
