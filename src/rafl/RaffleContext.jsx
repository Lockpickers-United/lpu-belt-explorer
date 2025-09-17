import React, {useCallback, useContext, useMemo, useState} from 'react'
import useData from '../util/useData'
import {raflPreviewPots} from '../data/dataUrls'
import raflData from '../data/rafl.json'
import raflCharities from '../data/raflCharities.json'
import DBContext from '../app/DBContext.jsx'
import removeAccents from 'remove-accents'
import collectionOptions from '../data/collectionTypes'
import {useLocalStorage} from 'usehooks-ts'
import dayjs from 'dayjs'
import raflHistoricalDonations from './raflHistoricalDonations.json'
import {setDeepAdd, setDeepPush} from '../util/setDeep'

const RaffleContext = React.createContext({})

const maxPots = 1

export function RaffleProvider({children}) {

    const {VITE_RAFL_STATE: raflState} = import.meta.env
    // preview, setup, live, post, hidden
    const [preview, setPreview] = useLocalStorage('previewMode', false)
    const {lockCollection, summaryData, winnerData} = useContext(DBContext)
    const summary = useMemo(() => {
        return {...summaryData}
    }, [summaryData])

    console.log('winnerData', winnerData)

    const {data, loading, error, refresh} = useData({urls})
    const allDataLoaded = (!loading && !error && !!data)
    const {raflPreviewPots} = data || {}

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
        return potEntries
            .map(entry => {
                const potWinners = winnerData?.[entry.id] || []
                const winnerUsernames = potWinners.map(w => w?.username).filter(u => !!u)
                const winnerEntryIds = potWinners.map(w => w?.entryId).filter(u => !!u)
                return {
                    ...entry,
                    ...summary.pots?.[entry.id],
                    uniqueDonorCount: summary.pots?.[entry.id]?.uniqueDonorCount || 0,
                    fuzzy: removeAccents([
                        entry.title,
                        entry.keywords,
                        ...entry.contributedBy,
                        // ...potWinners,
                        entry.potContents
                    ].join(',')),
                    collection: collectionOptions.raffle.map.map(m => lockCollection && lockCollection[m.key] && lockCollection[m.key].includes(entry.id) ? 'In ' + m.label : 'Not in ' + m.label),
                    sortPotNumber: entry.potNumber === '0' ? 98 : parseInt(entry.potNumber),
                    winners: potWinners,
                    winnerUsernames,
                    winnerEntryIds
                }
            })
    }, [preview, allDataLoaded, raflPreviewPots, winnerData, summary.pots, lockCollection])

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
    }, [summary.charities])

    const winnerList = useMemo(() => {
        if (!winnerData) return {}
        return Object.keys(winnerData).reduce((acc, potId) => {
            winnerData[potId].forEach(winner => {
                const winnerName = `${winner?.username || ''}|${winner?.platform || ''}`.trim()
                setDeepAdd(acc, [winnerName], 1)
            })
            return acc
        }, {})
    }, [winnerData])
    console.log('winnerList', winnerList)

    const excessWinners = Object.keys(winnerList).filter(k => (winnerList[k] || 0) > maxPots).sort((a, b) => a.localeCompare(b))
    console.log('excessWinners', excessWinners)

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
        summary,
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
        preview, setPreview, refresh
    }), [
        allDataLoaded,
        allPots,
        allCharities,
        summary,
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
