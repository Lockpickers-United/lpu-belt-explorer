import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import usePageTitle from '../util/usePageTitle'
import StatsMainPage from './StatsMainPage'
import {
    brandDistribution,
    collectionsSummary,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteSummary
} from '../data/dataUrls'

function StatsRoute() {
    const {data, loading, error} = useData({urls})
    usePageTitle('Stats & Insights')

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
    brandDistribution,
    collectionsSummary,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteSummary
}

export default StatsRoute
