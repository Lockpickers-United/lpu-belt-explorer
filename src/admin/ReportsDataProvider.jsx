import React, {useMemo} from 'react'
import {
    brandDistribution,
    collectionsStatsCurrent,
    collectionsSummary,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteFullNew
} from '../data/dataUrls'
import useData from '../util/useData.jsx'
import ReportsContext from './ReportsContext.jsx'


export function ReportsDataProvider({children}) {

    const {data, loading, error} = useData({urls})

    const foo = 'bar'

    const {
        brandDistribution,
        collectionsStatsCurrent,
        collectionsSummary,
        lockSummary,
        popularAreas,
        redditGrowth,
        siteFullNew
    } = data || {}

    const value = useMemo(() => ({
            foo,
            data,
            loading,
            error,
            brandDistribution,
            collectionsStatsCurrent,
            collectionsSummary,
            lockSummary,
            popularAreas,
            redditGrowth,
            siteFullNew
        }),
        [foo, data, loading, error, brandDistribution, collectionsStatsCurrent, collectionsSummary, lockSummary, popularAreas, redditGrowth, siteFullNew])

    return (
        <ReportsContext.Provider value={value}>
            {children}
        </ReportsContext.Provider>
    )
}

const urls = {
    brandDistribution,
    collectionsStatsCurrent,
    collectionsSummary,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteFullNew
}

export default ReportsDataProvider
