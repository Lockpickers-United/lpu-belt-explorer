import React, {useMemo} from 'react'
import {
    brandDistribution,
    collectionsStatsCurrent,
    lockSummary,
    popularAreas,
    redditGrowth,
    siteFullNew
} from '../data/dataUrls'
import useData from '../util/useData.jsx'
import ReportsContext from './ReportsContext.jsx'


export function ReportsDataProvider({children}) {

    const {data, loading, error} = useData({urls})

    const {
        brandDistribution,
        collectionsStatsCurrent,
        lockSummary,
        popularAreas,
        redditGrowth,
        siteFullNew
    } = data || {}

    const value = useMemo(() => ({
            data,
            loading,
            error,
            brandDistribution,
            collectionsStatsCurrent,
            lockSummary,
            popularAreas,
            redditGrowth,
            siteFullNew
        }),
        [data, loading, error, brandDistribution, collectionsStatsCurrent, lockSummary, popularAreas, redditGrowth, siteFullNew])

    return (
        <ReportsContext.Provider value={value}>
            {children}
        </ReportsContext.Provider>
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

export default ReportsDataProvider
