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
    collectionsStatsCurrent,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteFullNew
} from '../data/dataUrls'

function StatsRoute() {

    usePageTitle('Stats & Insights')
    const {data, loading, error} = useData({urls})

    return (
            <React.Fragment>
                <Nav title='Stats & Insights'/>

                {loading && <LoadingDisplay/>}

                {!loading && !error && data &&
                    <StatsMainPage data={data}/>
                }

                <Footer/>

                <Tracker feature='stats'/>
            </React.Fragment>
    )
}

const urls = {
    brandDistribution,
    collectionsStatsCurrent,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteFullNew
}

export default StatsRoute
