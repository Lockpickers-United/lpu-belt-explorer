import React, {useCallback, useMemo} from 'react'
import {
    brandDistribution,
    collectionsStatsCurrent,
    popularAreas, redditGrowth, siteFullNew, collectionStatsDaily
} from '../data/dataUrls'
import useData from '../util/useData.jsx'

const ReportsContext = React.createContext({})

export function ReportsProvider({children}) {

    const {data, loading, error} = useData({urls})
    const allDataLoaded = !loading && !error && !!data

    const {
        brandDistribution,
        collectionsStatsCurrent,
        collectionStatsDaily,
        popularAreas,
        redditGrowth,
        siteFullNew,
    } = data || {}

    const collectionListLabels = useMemo(() => ({
        allLists: 'All Lists',
        own: 'Own',
        picked: 'Picked',
        recorded: 'Recorded',
        recordedLocks: 'Scorecard',
        wishlist: 'Wishlist',
        safelocksOwn: 'Safelocks Own',
        safelocksCracked: 'Safelocks Cracked',
        safelocksWishlist: 'Safelocks Wishlist',
        raffleWatchlist: 'Raffle Watchlist',
        awards: 'Awards',
        projects: 'Projects'
    }), [])


    const collectionList = useMemo(() => ([
        {listName: 'allLists', label: 'All Lists'},
        {listName: 'own', label: 'Own'},
        {listName: 'picked', label: 'Picked'},
        {listName: 'recorded', label: 'Recorded'},
        {listName: 'recordedLocks', label: 'Scorecard'},
        {listName: 'wishlist', label: 'Wishlist'},
        {listName: 'safelocksOwn', label: 'Safelocks Own'},
        {listName: 'safelocksCracked', label: 'Safelocks Cracked'},
        {listName: 'safelocksWishlist', label: 'Safelocks Wishlist'},
        {listName: 'raffleWatchlist', label: 'Raffle Watchlist'},
        {listName: 'awards', label: 'Awards'},
        {listName: 'projects', label: 'Projects'}
    ]), [])

    const collectionSummary = useCallback((cohort) => (
        allDataLoaded
            ? {
                columns: [
                    {name: 'List Name', id: 'list', align: 'left'},
                    {align: 'center', id: 'totalUsers', name: 'Total Users'},
                    {name: 'List Users', align: 'center', id: 'userCount'},
                    {id: 'totalSaves', align: 'center', name: 'Total Saves'},
                    {name: '% List Users', id: 'percentListUsers', align: 'center'},
                    {id: 'averageSaves', align: 'center', name: 'Average Items'}
                ],
                data: collectionList.map(list => {
                    const {
                        userCount,
                        totalSaves,
                        averageSaves
                    } = data.collectionsStatsCurrent[cohort].listStats[list.listName]
                    return {
                        totalUsers: data.collectionsStatsCurrent[cohort].totalProfiles,
                        list: list.label,
                        userCount,
                        listUsers: userCount,
                        totalSaves,
                        percentListUsers: Math.round(100 * userCount / data.collectionsStatsCurrent[cohort].listStats.allLists.userCount) + '%',
                        averageSaves: Math.round(averageSaves)
                    }
                })
            }
            : {}
    ), [allDataLoaded, collectionList, data])

    const value = useMemo(() => ({
        data, loading, error,
        allDataLoaded,
        brandDistribution,
        collectionsStatsCurrent,
        collectionStatsDaily,
        popularAreas,
        redditGrowth,
        siteFullNew,
        collectionListLabels,
        collectionSummary
    }), [
        data, loading, error,
        allDataLoaded,
        brandDistribution,
        collectionsStatsCurrent,
        collectionStatsDaily,
        popularAreas,
        redditGrowth,
        siteFullNew,
        collectionListLabels,
        collectionSummary
    ])

    return (
        <ReportsContext.Provider value={value}>
            {children}
        </ReportsContext.Provider>
    )
}

const urls = {
    brandDistribution,
    collectionsStatsCurrent,
    collectionStatsDaily,
    popularAreas,
    redditGrowth,
    siteFullNew,
}

export default ReportsContext