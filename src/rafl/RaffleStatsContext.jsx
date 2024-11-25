import React, {useCallback, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflStats} from '../data/dataUrls'

const RaffleStatsContext = React.createContext({})

export function RaffleStatsProvider({children}) {
    const {data, loading, error} = useData({url: raflStats})
    const {potStats, charityStats, summaryStats} = data || {}
    const allDataLoaded = (!loading && !error && !!data)
    
    const [displayStats, setDisplayStats] = useState(false)
    const [animateTotal, setAnimateTotal] = useState(true)

    const toggleStats = useCallback(() => {
            setDisplayStats(!displayStats)
    },[displayStats])

    const value = useMemo(() => ({
        allDataLoaded,
        potStats,
        charityStats,
        summaryStats,
        displayStats,
        toggleStats,
        animateTotal,
        setAnimateTotal
    }), [
        allDataLoaded,
        potStats,
        charityStats,
        summaryStats,
        displayStats,
        toggleStats,
        animateTotal,
        setAnimateTotal
    ])

    return (
        <RaffleStatsContext.Provider value={value}>
            {children}
        </RaffleStatsContext.Provider>
    )
}

export default RaffleStatsContext
