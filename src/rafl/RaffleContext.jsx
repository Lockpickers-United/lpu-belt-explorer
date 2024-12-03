import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflStats} from '../data/dataUrls'
import DBContext from '../app/DBContext.jsx'

const RaffleContext = React.createContext({})

export function RaffleStatsProvider({children}) {

    const live = true
    const {lockCollection} = useContext(DBContext)
    const {data, loading, error} = useData({url: raflStats})
    const {potStats, charityStats, summaryStats} = data || {}
    const allDataLoaded = (!loading && !error && !!data)
    const [displayStats, setDisplayStats] = useState(false)
    const [animateTotal, setAnimateTotal] = useState(true)

    const profileLoaded = Object.keys(lockCollection).length > 0
    const {admin, adminRaffle} = lockCollection
    const raffleAdmin = admin || adminRaffle

    const [raffleAdminRole, setRaffleAdminRole] = useState(false)

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
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        live
    }), [
        allDataLoaded,
        potStats,
        charityStats,
        summaryStats,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        live
    ])

    return (
        <RaffleContext.Provider value={value}>
            {children}
        </RaffleContext.Provider>
    )
}

export default RaffleContext
