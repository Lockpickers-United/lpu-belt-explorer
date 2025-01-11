import React, {useMemo} from 'react'
import {
    brandDistribution,
    collectionsStatsCurrent,
    collectionsSummary,
    collectionsFull,
    lockSummary,
    popularAreas, redditGrowth, siteFullNew, collectionStatsDaily
} from '../data/dataUrls'
import useData from '../util/useData.jsx'

const ReportsContext = React.createContext({})

export function ReportsProvider({children}) {

    const {data, loading, error} = useData({urls})
    const allDataLoaded = !loading && !error && !!data


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

    const collectionSummary = useMemo(() => (allDataLoaded
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
                    } = data.collectionsStatsCurrent.allUsers.listStats[list.listName]
                    return {
                        totalUsers: data.collectionsStatsCurrent.allUsers.totalProfiles,
                        list: list.label,
                        userCount,
                        listUsers: userCount,
                        totalSaves,
                        percentListUsers: Math.round(100 * userCount / data.collectionsStatsCurrent.allUsers.listStats.allLists.userCount) + '%',
                        averageSaves: Math.round(averageSaves)
                    }
                })
            }
            : {}
    ), [allDataLoaded, collectionList, data])

    const value = useMemo(() => ({
        data, loading, error,
        collectionListLabels,
        collectionSummary
    }), [data, loading, error,
        collectionListLabels,
        collectionSummary])

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
    collectionsSummary,
    collectionsFull,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteFullNew
}

export default ReportsContext