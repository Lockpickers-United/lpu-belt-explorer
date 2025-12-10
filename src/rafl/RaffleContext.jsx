import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflPreviewPots, raflPreviewVersion} from '../data/dataUrls'
import raflData from '../data/rafl.json'
import raflCharities from '../data/raflCharities.json'
import DBContext from '../app/DBContext.jsx'
import removeAccents from 'remove-accents'
import collectionOptions from '../data/collectionTypes'
import {useLocalStorage} from 'usehooks-ts'
import dayjs from 'dayjs'
import raflHistoricalDonations from './raflHistoricalDonations.json'
import {setDeepAdd, setDeepPush} from '../util/setDeep'
import AuthContext from '../app/AuthContext.jsx'

const RaffleContext = React.createContext({})

const maxPots = 1

export function RaffleProvider({children}) {

    const {VITE_RAFL_STATE: raflState} = import.meta.env
    // preview, setup, live, post, hidden
    const [preview, setPreview] = useLocalStorage('previewMode', false)
    const {lockCollection, summaryData, winnerData} = useContext(DBContext)
    const {userClaims} = useContext(AuthContext)
    const raffleAdmin = ['raflAdmin', 'admin'].some(claim => userClaims.includes(claim))
    const [raffleAdminRole, setRaffleAdminRole] = useState(false)

    const profileLoaded = Object.keys(lockCollection).length > 0

    const summary = useMemo(() => {
        return {...summaryData}
    }, [summaryData])

    const winnerList = useMemo(() => {
        if (!winnerData) return {}
        return Object.keys(winnerData).reduce((acc, potId) => {
            winnerData[potId].forEach(winner => {
                setDeepAdd(acc, [winner.entryId], 1)
            })
            return acc
        }, {})
    }, [winnerData])

    const excessWinners = Object.keys(winnerList).filter(k => (winnerList[k] || 0) > maxPots).sort((a, b) => a.localeCompare(b))

    const {data, loading, error, refresh} = useData({urls})
    const allDataLoaded = (!loading && !error && !!data)
    const {raflPreviewPots, raflPreviewVersion} = data || {}

    const firstDate = dayjs('2025-09-01')
    const entryDates = Object.keys(summary?.entriesByDate || {}).sort().reduce((acc, date) => {
        acc.startDate = acc.startDate ? dayjs(acc.startDate).isBefore(dayjs(date)) ? acc.startDate : date : date
        acc.endDate = acc.endDate ? dayjs(acc.endDate).isAfter(dayjs(date)) ? acc.endDate : date : date
        return acc
    }, {startDate: null, endDate: null})
    const startDate = dayjs(entryDates.startDate).isAfter(firstDate) ? entryDates.startDate : firstDate.format('YYYY-MM-DD')

    summary.years = raflHistoricalDonations.years

    summary.historicalDonations = useMemo(() => {
        return raflHistoricalDonations.daily.map(day => ({
            ...day,
            raflDate: dayjs(startDate).add(day['Day'] - 1, 'day').format('YYYY-MM-DD') + ' 23:59:59',
            totalDonations: day.totalDonations,
            cumulativeDonations: day.cumulativeDonations
        }))
    }, [startDate])
    summary.lineDataCurrent = Object.keys(summary.entriesByDate || {})
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, day) => {
            const date = day + ' 23:59:59'
            if (dayjs(date).isBefore(dayjs(startDate))) return acc
            setDeepPush(acc, ['totalEntries'], {x: date, y: summary.entriesByDate[day].totalEntries})
            setDeepPush(acc, ['cumulativeUniqueDonors'], {
                x: date,
                y: summary.entriesByDate[day].cumulativeUniqueDonors
            })
            setDeepPush(acc, ['totalDonations'], {x: date, y: summary.entriesByDate[day].totalDonations})
            setDeepPush(acc, ['cumulativeDonations'], {x: date, y: summary.entriesByDate[day].cumulativeDonations})
            return acc
        }, [])
    summary.historicalLineData = (summary.historicalDonations || []).reduce((acc, day) => {
        const date = day.raflDate
        if (dayjs(date).isBefore(dayjs(startDate))) return acc
        summary.years.map(year => {
            setDeepPush(acc, ['totalDonations' + year], {x: date, y: day[year]})
            setDeepPush(acc, ['cumulativeDonations' + year], {x: date, y: day[year + 'cumulative']})
        })
        return acc
    }, [])

    const allPots = useMemo(() => {
        const potEntries = preview && allDataLoaded
            ? raflPreviewPots ?? []
            : raflData

        const drawingBegun = potEntries.reduce((acc, pot) => acc || !!winnerData?.[pot.id], false)

        return potEntries
            .map(entry => {
                const potWinners = winnerData?.[entry.id] || []
                const winnerUsernames = potWinners.map(w => w?.username).filter(u => !!u)
                const winnerFilterNames = potWinners.map(w => `${w?.username} (${w?.platform})`).filter(u => !!u)
                const winnerEntryIds = potWinners.map(w => w?.entryId).filter(u => !!u)
                const excessWinner = winnerEntryIds.some(e => excessWinners.includes(e))

                return {
                    ...entry,
                    totalTickets: summary.pots?.[entry.id]?.totalTickets || 0,
                    uniqueDonorCount: summary.pots?.[entry.id]?.uniqueDonorCount || 0,
                    fuzzy: removeAccents([
                        entry.title,
                        entry.keywords,
                        ...entry.contributedBy,
                        // ...potWinners,
                        entry.potContents
                    ].join(',')),
                    collection: collectionOptions.raffle.map.map(m => lockCollection && lockCollection[m.key] && lockCollection[m.key].includes(entry.id) ? 'In ' + m.label : 'Not in ' + m.label),
                    sortPotNumber: entry.potNumber === 0 ? 98 : entry.potNumber,
                    winners: potWinners,
                    winnerUsernames,
                    winnerEntryIds,
                    winnerFilterNames,
                    winnerStatus: drawingBegun
                        ? [potWinners.length > 0 ? 'Winners Selected' :  'Winners Not Selected', excessWinner ? 'Too many wins' : null].filter(x => x)
                        : []
                }
            })
    }, [preview, allDataLoaded, raflPreviewPots, winnerData, summary.pots, excessWinners, lockCollection])

    // Precompute helper structures for winners: counts and a Set for fast checks
    const winnerCounts = useMemo(() => ({...(summary.winnerCounts || {})}), [summary.winnerCounts])
    const multipleWinners = useMemo(() => ([...(summary.multipleWinners || [])]), [summary.multipleWinners])
    const multipleWinnerSet = useMemo(() => new Set(multipleWinners), [multipleWinners])

    const allCharities = useMemo(() => {
        return raflCharities
            .map(entry => ({
                ...entry,
                fuzzy: removeAccents([
                    entry.name,
                    entry.tags
                ].join(',')),
                donors: summary.charities?.[entry.id]?.uniqueDonorCount,
                donations: summary.charities?.[entry.id]?.totalDonations,
                donationsText: `$${summary.charities?.[entry.id]?.totalDonations}`,
                donations2024text: entry.donations2024 ? '$' + entry.donations2024.toLocaleString() : '0',
                donations2025text: entry.donations2025 ? '$' + entry.donations2025.toLocaleString() : '0'
            }))
            .filter(entry => !entry.disabled)
    }, [summary.charities])

    const [displayStats, setDisplayStats] = useState(false)
    const [animateTotal, setAnimateTotal] = useState(false)

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
        summary,
        excessWinners,
        winnerCounts,
        multipleWinners,
        multipleWinnerSet,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        raflState,
        raflPreviewVersion,
        preview, setPreview, refresh
    }), [
        allDataLoaded,
        allPots,
        allCharities,
        summary,
        excessWinners,
        winnerCounts,
        multipleWinners,
        multipleWinnerSet,
        displayStats, setDisplayStats,
        toggleStats,
        animateTotal, setAnimateTotal,
        formPots, setFormPots,
        updateFormPots,
        profileLoaded,
        raffleAdmin, raffleAdminRole, setRaffleAdminRole,
        raflState,
        raflPreviewVersion,
        preview, setPreview, refresh
    ])

    return (
        <RaffleContext.Provider value={value}>
            {children}
        </RaffleContext.Provider>
    )
}

const urls = {
    raflPreviewPots, raflPreviewVersion
}

export default RaffleContext
