import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflStats, raflQuestionMap, raflResponseSummary} from '../data/dataUrls'
import raflData from '../data/rafl.json'

import DBContext from '../app/DBContext.jsx'

const RaffleContext = React.createContext({})

export function RaffleStatsProvider({children}) {

    const live = false
    const {lockCollection} = useContext(DBContext)
    const {data, loading, error} = useData({urls})

    const {raflStats, raflQuestionMap, raflResponseSummary} = data || {}

    const {potStats, charityStats, summaryStats} = raflStats || {}
    const allDataLoaded = (!loading && !error && !!data)
    const [displayStats, setDisplayStats] = useState(false)
    const [animateTotal, setAnimateTotal] = useState(true)

    const profileLoaded = Object.keys(lockCollection).length > 0
    const {admin, adminRaffle} = lockCollection
    const raffleAdmin = admin || adminRaffle

    const [raffleAdminRole, setRaffleAdminRole] = useState(false)

    const toggleStats = useCallback(() => {
        setDisplayStats(!displayStats)
    }, [displayStats])

    const [formPots, setFormPots] = useState({})

    const updateFormPots = useCallback(pots => {
        setFormPots(pots)
    }, [])

    const potSummaryStats = useMemo(() => raflResponseSummary && Object.keys(raflResponseSummary?.potDonorCount).reduce((acc, key) => {
            const questionPotTitle = key.replace(/Pot.*- /, '')
            const sitePot = raflData.find(pot => pot.title === questionPotTitle)
            if (sitePot) {
                acc[sitePot.id] = {
                    donors: raflResponseSummary?.potDonorCount[key],
                    tickets: raflResponseSummary?.potTickets[key]
                }
            }
            return acc
        }, {}),[raflResponseSummary]
    )

    const charitySummaryStats = useMemo(() => raflResponseSummary && Object.keys(raflResponseSummary?.charityDonorCount).reduce((acc, key) => {
                acc[key] = {
                    donors: raflResponseSummary?.charityDonorCount[key],
                    donations: raflResponseSummary?.charityDonations[key]
                }
            return acc
        }, {}),[raflResponseSummary]
    )

    const value = useMemo(() => ({
        allDataLoaded,
        raflQuestionMap,
        raflResponseSummary,
        potSummaryStats,
        charitySummaryStats,
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
        raflQuestionMap,
        raflResponseSummary,
        potSummaryStats,
        charitySummaryStats,
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

const urls = {
    raflStats,
    raflQuestionMap,
    raflResponseSummary
}

export default RaffleContext
