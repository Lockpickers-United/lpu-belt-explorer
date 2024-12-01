import React, {useCallback, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflStats} from '../data/dataUrls'

const RaffleContext = React.createContext({})

export function RaffleStatsProvider({children}) {
    const {data, loading, error} = useData({url: raflStats})
    const {potStats, charityStats, summaryStats} = data || {}
    const allDataLoaded = (!loading && !error && !!data)
    const [displayStats, setDisplayStats] = useState(false)
    const [animateTotal, setAnimateTotal] = useState(true)

    const toggleStats = useCallback(() => {
            setDisplayStats(!displayStats)
    },[displayStats])

    const [formPots, setFormPots] = useState({})

    const updateFormPots = useCallback(pots => {
        setFormPots(pots)
    },[])

    const value = useMemo(() => ({
        allDataLoaded,
        potStats,
        charityStats,
        summaryStats,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots
    }), [
        allDataLoaded,
        potStats,
        charityStats,
        summaryStats,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots
    ])

    return (
        <RaffleContext.Provider value={value}>
            {children}
        </RaffleContext.Provider>
    )
}

export default RaffleContext
