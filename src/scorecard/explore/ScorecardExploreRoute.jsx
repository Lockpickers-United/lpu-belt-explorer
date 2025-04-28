import React, {useContext} from 'react'
import Tracker from '../../app/Tracker'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import LoadingDisplay from '../../util/LoadingDisplay'
import useData from '../../util/useData'
import usePageTitle from '../../util/usePageTitle'
import lockStats from '../../data/lockStats.json'
import {
    brandDistribution,
    collectionsStatsCurrent,
    popularAreas,
    redditGrowth,
    siteFullNew,
    pickStatsData,
    scorecardStats,
    discordRoleCounts
} from '../../data/dataUrls'
import ErrorMessage from '../../misc/ErrorMessage.jsx'
import ScorecardExplore from './ScorecardExplore.jsx'
import {scorecardExploreFilterFields} from '../../data/filterFields'
import allEntries from '../../data/data.json'
import {DataProvider} from './ScorecardExploreDataProvider.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import DBContext from '../../app/DBContext.jsx'

/**
 * @prop lockCountsByUserBelt
 */

export default function ScorecardExploreRoute() {
    const {lockCollection} = useContext(DBContext)

    usePageTitle('Explore Scorecard')
    const {data, loading, error, errorMessage} = useData({urls})

    return (
        <React.Fragment>
            <Nav title='Explore Scorecard'/>

            {error && <ErrorMessage errorMessage={errorMessage}/>}

            {loading && <LoadingDisplay/>}

            {!loading && !error && !!data &&
                <FilterProvider filterFields={scorecardExploreFilterFields}>
                    <DataProvider allEntries={allEntries} scorecardEntries={data.scorecardStats.lockCountsByUserBelt} profile={lockCollection}>
                        <ScorecardExplore data={{...data, lockStats}}/>
                    </DataProvider>
                </FilterProvider>
            }

            <Footer/>

            <Tracker feature='stats'/>
        </React.Fragment>
    )
}

const urls = {
    brandDistribution,
    collectionsStatsCurrent,
    popularAreas,
    redditGrowth,
    siteFullNew,
    pickStatsData,
    scorecardStats,
    discordRoleCounts
}
