import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflJsonUrl, raflQuestionMap, raflResponseDetails2} from '../data/dataUrls'
import raflData from '../data/rafl.json'
import raflCharities from '../data/raflCharities.json'
import DBContext from '../app/DBContext.jsx'
import removeAccents from 'remove-accents'
import collectionOptions from '../data/collectionTypes'
import {useLocalStorage} from 'usehooks-ts'
import {setDeepAdd} from '../util/useSetDeep'

const RaffleContext = React.createContext({})

export function RaffleProvider({children}) {

    const {VITE_RAFL_STATE: raflState} = import.meta.env
    // preview, setup, live, post, hidden
    const [preview, setPreview] = useLocalStorage('previewMode', false)

    const {lockCollection} = useContext(DBContext)
    const {data, loading, error, refresh} = useData({urls})
    const allDataLoaded = (!loading && !error && !!data)

    const {raflQuestionMap, raflResponseDetails2, raflJsonUrl} = data || {}

    const raflSummaryStats = useMemo(() => {
        return raflResponseDetails2
            ? Object.keys(raflResponseDetails2).reduce((acc, day) => {
                setDeepAdd(acc, ['totalDonors'], raflResponseDetails2[day]['totalDonors'])
                setDeepAdd(acc, ['totalDonations'], raflResponseDetails2[day]['totalDonations'])
                Object.keys(raflResponseDetails2[day]['platforms']).forEach(platform => {
                    setDeepAdd(acc, ['platformDonations', platform], raflResponseDetails2[day]['platforms'][platform].donations)
                    setDeepAdd(acc, ['platformDonors', platform], raflResponseDetails2[day]['platforms'][platform].donors)
                })
                return acc
            }, {})
            : {}
    },[raflResponseDetails2])

    const potSummaryStats = useMemo(() => {
        return raflResponseDetails2
            ? Object.keys(raflResponseDetails2).reduce((acc, day) => {
                Object.keys(raflResponseDetails2[day]['pots']).forEach(potId => {
                    setDeepAdd(acc, [potId, 'donors'], raflResponseDetails2[day]['pots'][potId].donors)
                    setDeepAdd(acc, [potId, 'tickets'], raflResponseDetails2[day]['pots'][potId].tickets)
                })
                return acc
            }, {})
            : {}
    },[raflResponseDetails2])

    const allPots = useMemo(() => {
        const potEntries = preview && allDataLoaded
            ? raflJsonUrl ?? []
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
    }, [preview, allDataLoaded, raflJsonUrl, raflQuestionMap, potSummaryStats, lockCollection])

    const charitySummaryStats = useMemo(() => {
        return raflResponseDetails2
            ? Object.keys(raflResponseDetails2).reduce((acc, day) => {
                Object.keys(raflResponseDetails2[day]['charities']).forEach(charity => {
                    setDeepAdd(acc, [charity, 'donors'], raflResponseDetails2[day]['charities'][charity].donors)
                    setDeepAdd(acc, [charity, 'donations'], raflResponseDetails2[day]['charities'][charity].donations)
                })
                return acc
            }, {})
            : {}
    },[raflResponseDetails2])

    const allCharities = useMemo(() => {
        return raflCharities
            .map(entry => ({
                ...entry,
                fuzzy: removeAccents([
                    entry.name
                ].join(',')),
                donors: charitySummaryStats && charitySummaryStats[entry.name] ? charitySummaryStats[entry.name].donors : 0,
                donations: charitySummaryStats && charitySummaryStats[entry.name] ? charitySummaryStats[entry.name].donations : 0
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
    raflResponseDetails2,
    raflJsonUrl
}

export default RaffleContext
