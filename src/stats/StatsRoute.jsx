import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import usePageTitle from '../util/usePageTitle'
import StatsMainPage from './StatsMainPage'
import {
    lockStats,
    brandDistribution,
    collectionsStatsCurrent,
    popularAreas,
    redditGrowth,
    siteFullNew
} from '../data/dataUrls'
import ErrorMessage from '../misc/ErrorMessage.jsx'

function StatsRoute() {

    usePageTitle('Stats & Insights')
    const {data, loading, error, errorMessage} = useData({urls})

    return (
        <React.Fragment>
            <Nav title='Stats & Insights'/>

            {error && <ErrorMessage errorMessage={errorMessage}/>}

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
    lockStats,
    brandDistribution,
    collectionsStatsCurrent,
    popularAreas,
    redditGrowth,
    siteFullNew
}

export default StatsRoute
