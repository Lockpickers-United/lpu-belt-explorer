import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflPreviewPots, raflQuestionMap, raflResponseDetails} from '../data/dataUrls'
import raflData from '../data/rafl.json'
import raflCharities from '../data/raflCharities.json'
import DBContext from '../app/DBContext.jsx'
import removeAccents from 'remove-accents'
import collectionOptions from '../data/collectionTypes'
import {useLocalStorage} from 'usehooks-ts'
import {setDeepAdd} from '../util/setDeep'

/**
 * @property summaryData
 * @property totalDonorCount
 * @property totalDonorCountUnique
 * @property platformDonorCount
 * @property platformDonorCountUnique
 * @property detailedData
 * @property donorsUnique
 */

const RaffleContext = React.createContext({})

export function RaffleProvider({children}) {

    const {VITE_RAFL_STATE: raflState} = import.meta.env
    // preview, setup, live, post, hidden
    const [preview, setPreview] = useLocalStorage('previewMode', false)

    const {lockCollection} = useContext(DBContext)
    const {data, loading, error, refresh} = useData({urls})
    const allDataLoaded = (!loading && !error && !!data)

    const {raflQuestionMap, raflResponseDetails, raflPreviewPots} = data || {}

    const raflSummaryStats = useMemo(() => {
        const totalDonors = raflResponseDetails?.summaryData?.totalDonorCount
        const uniqueDonors = raflResponseDetails?.summaryData?.totalDonorCountUnique
        const totalDonations = raflResponseDetails?.summaryData?.totalDonations
        const platformDonations = raflResponseDetails?.summaryData?.platformDonations
        const platformDonors = raflResponseDetails?.summaryData?.platformDonorCount
        const platformDonorsUnique = raflResponseDetails?.summaryData?.platformDonorCountUnique

        return {totalDonors, uniqueDonors, totalDonations, platformDonations, platformDonors, platformDonorsUnique}
    }, [raflResponseDetails])

    const potSummaryStats = useMemo(() => {
        return raflResponseDetails
            ? Object.keys(raflResponseDetails.detailedData).reduce((acc, day) => {
                const pots = raflResponseDetails.detailedData[day]['pots'] ? raflResponseDetails.detailedData[day]['pots'] : {}
                Object.keys(pots).forEach(potId => {
                    setDeepAdd(acc, [potId, 'donors'], pots[potId].donorsUnique)
                    setDeepAdd(acc, [potId, 'tickets'], pots[potId].tickets)
                })
                return acc
            }, {})
            : {}
    },[raflResponseDetails])

    const allPots = useMemo(() => {
        const potEntries = preview && allDataLoaded
            ? raflPreviewPots ?? []
            : raflData
        return potEntries
            .map(entry => {
                const question = raflQuestionMap?.find(q => q.text.includes(entry.title))
                return {
                    ...entry,
                    fuzzy: removeAccents([
                        entry.title,
                        entry.contributedBy.join(','),
                        entry.winner,
                        entry.description,
                        entry.potContents,
                    ].join(',')),
                    collection: collectionOptions.raffle.map.map(m => lockCollection && lockCollection[m.key] && lockCollection[m.key].includes(entry.id) ? 'In ' + m.label : 'Not in ' + m.label),
                    tickets: potSummaryStats && potSummaryStats[entry.id] ? potSummaryStats[entry.id].tickets : 0,
                    donors: potSummaryStats && potSummaryStats[entry.id] ? potSummaryStats[entry.id].donors : 0,
                    formId: question ? question.formId : 0,
                    sortPotNumber: entry.potNumber === '0' ? 98 : parseInt(entry.potNumber)
                }
            })
    }, [preview, allDataLoaded, raflPreviewPots, raflQuestionMap, potSummaryStats, lockCollection])

    const charitySummaryStats = useMemo(() => {
        return raflResponseDetails
            ? Object.keys(raflResponseDetails.detailedData).reduce((acc, day) => {
                Object.keys(raflResponseDetails.detailedData[day]['charities']).forEach(charity => {
                    setDeepAdd(acc, [charity, 'donors'], raflResponseDetails.detailedData[day]['charities'][charity].donorsUnique)
                    setDeepAdd(acc, [charity, 'donations'], raflResponseDetails.detailedData[day]['charities'][charity].donations)
                })
                return acc
            }, {})
            : {}
    },[raflResponseDetails])

    const allCharities = useMemo(() => {
        return raflCharities
            .map(entry => ({
                ...entry,
                fuzzy: removeAccents([
                    entry.name,
                    entry.tags
                ].join(',')),
            }))
    }, [])

    const [displayStats, setDisplayStats] = useState(false)
    const [animateTotal, setAnimateTotal] = useState(false)

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
        raflSummaryStats,
        potSummaryStats,
        charitySummaryStats,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        raflState,
        preview, setPreview, refresh
    }), [
        allDataLoaded,
        allPots,
        allCharities,
        raflQuestionMap,
        raflSummaryStats,
        potSummaryStats,
        charitySummaryStats,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        raflState,
        preview, setPreview, refresh
    ])

    return (
        <RaffleContext.Provider value={value}>
            {children}
        </RaffleContext.Provider>
    )
}

const urls = {
    raflQuestionMap,
    raflResponseDetails,
    raflPreviewPots
}

export default RaffleContext
