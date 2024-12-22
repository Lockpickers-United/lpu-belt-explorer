import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflQuestionMap, raflResponseSummary} from '../data/dataUrls'
import raflData from '../data/rafl.json'
import raflCharities from '../data/raflCharities.json'

import DBContext from '../app/DBContext.jsx'
import removeAccents from 'remove-accents'
import collectionOptions from '../data/collectionTypes'

const RaffleContext = React.createContext({})

export function RaffleProvider({children}) {

    const {VITE_RAFL_STATE: raflState} = import.meta.env
    // preview, live, post, hidden

    const live = false

    const {lockCollection} = useContext(DBContext)
    const {data, loading, error} = useData({urls})
    const allDataLoaded = (!loading && !error && !!data)

    const {raflQuestionMap, raflResponseSummary} = data || {}

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

    const allPots = useMemo(() => {

        return raflData
            .map(entry => {
                const question = raflQuestionMap?.find(q => q.text.includes(entry.title))
                return {
                    ...entry,
                    fuzzy: removeAccents([
                        entry.title,
                        entry.winner,
                        entry.description,
                        entry.potContents,
                    ].join(',')),
                    collection: collectionOptions.raffle.map.map(m => lockCollection && lockCollection[m.key] && lockCollection[m.key].includes(entry.id) ? 'In ' + m.label : 'Not in ' + m.label),
                    tickets: potSummaryStats && potSummaryStats[entry.id] ? potSummaryStats[entry.id].tickets : 0,
                    donors: potSummaryStats && potSummaryStats[entry.id] ? potSummaryStats[entry.id].donors : 0,
                    formId: question ? question.formId : 0
                }
            })
    }, [potSummaryStats, raflQuestionMap, lockCollection])

    const charitySummaryStats = useMemo(() => raflResponseSummary && Object.keys(raflResponseSummary?.charityDonorCount).reduce((acc, key) => {
            acc[key] = {
                donors: raflResponseSummary?.charityDonorCount[key],
                donations: raflResponseSummary?.charityDonations[key]
            }
            return acc
        }, {}),[raflResponseSummary]
    )

    const allCharities = useMemo(() => {
        return raflCharities
            .map(entry => ({
                ...entry,
                fuzzy: removeAccents([
                    entry.name
                ].join(',')),
                donors: charitySummaryStats && charitySummaryStats[entry.name] ? charitySummaryStats[entry.name].donors : 0,
                donations: charitySummaryStats && charitySummaryStats[entry.name] ? charitySummaryStats[entry.name].donations : 0,
            }))
    }, [charitySummaryStats])

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


    const value = useMemo(() => ({
        allDataLoaded,
        allPots,
        allCharities,
        raflQuestionMap,
        raflResponseSummary,
        potSummaryStats,
        charitySummaryStats,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        live, raflState
    }), [
        allDataLoaded,
        allPots,
        allCharities,
        raflQuestionMap,
        raflResponseSummary,
        potSummaryStats,
        charitySummaryStats,

        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        live, raflState
    ])

    return (
        <RaffleContext.Provider value={value}>
            {children}
        </RaffleContext.Provider>
    )
}

const urls = {
    raflQuestionMap,
    raflResponseSummary
}

export default RaffleContext
