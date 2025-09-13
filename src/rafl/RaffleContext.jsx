import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflPreviewPots} from '../data/dataUrls'
import raflData from '../data/rafl.json'
import raflCharities from '../data/raflCharities.json'
import DBContext from '../app/DBContext.jsx'
import removeAccents from 'remove-accents'
import collectionOptions from '../data/collectionTypes'
import {useLocalStorage} from 'usehooks-ts'

const RaffleContext = React.createContext({})

export function RaffleProvider({children}) {

    const {VITE_RAFL_STATE: raflState} = import.meta.env
    // preview, setup, live, post, hidden
    const [preview, setPreview] = useLocalStorage('previewMode', false)

    const {lockCollection, summary} = useContext(DBContext)
    console.log('RaffleProvider lockCollection', lockCollection)

    const {data, loading, error, refresh} = useData({urls})
    const allDataLoaded = (!loading && !error && !!data)
    const {raflPreviewPots} = data || {}

    const allPots = useMemo(() => {
        const potEntries = preview && allDataLoaded
            ? raflPreviewPots ?? []
            : raflData
        return potEntries
            .map(entry => {
                const potWinners = summary.winners?.[entry.id] ? summary.winners[entry.id] : []
                return {
                    ...entry,
                    ...summary.pots?.[entry.id],
                    uniqueDonorCount: summary.pots?.[entry.id]?.uniqueDonors?.length || 0,
                    fuzzy: removeAccents([
                        entry.title,
                        entry.keywords,
                        ...entry.contributedBy,
                        ...potWinners,
                        entry.potContents
                    ].join(',')),
                    collection: collectionOptions.raffle.map.map(m => lockCollection && lockCollection[m.key] && lockCollection[m.key].includes(entry.id) ? 'In ' + m.label : 'Not in ' + m.label),
                    sortPotNumber: entry.potNumber === '0' ? 98 : parseInt(entry.potNumber),
                    winners: potWinners
                }
            })
    }, [preview, allDataLoaded, raflPreviewPots, summary, lockCollection])

    const allCharities = useMemo(() => {
        return raflCharities
            .map(entry => ({
                ...entry,
                fuzzy: removeAccents([
                    entry.name,
                    entry.tags
                ].join(',')),
                donations: summary.charities?.[entry.id]?.totalDonations,
                donationsText: `$${summary.charities?.[entry.id]?.totalDonations}`,
                donors: summary.charities?.[entry.id]?.uniqueDonors.length,
            }))
    }, [summary.charities])

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
    raflPreviewPots
}

export default RaffleContext
