import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {db} from '../../auth/firebase'
import {
    doc,
    onSnapshot,
    collection,
    query,
    where,
    deleteDoc,
    setDoc
} from 'firebase/firestore'
import AuthContext from '../../app/AuthContext'
import {enqueueSnackbar} from 'notistack'
import dayjs from 'dayjs'
import DBContextRaffle from '../DBContextRaffle.jsx'
import DBContext from '../../app/DBContext.jsx'
import RaffleContext from '../RaffleContext.jsx'
import {setDeep, setDeepAdd, setDeepUnique} from '../../util/setDeep'

/**
 * @property uniqueDonors
 */

export function RaffleAdminDBProvider({children}) {

    const globalContext = useContext(DBContextRaffle)

    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const {profile, winnerData} = useContext(DBContext)
    const {raffleAdmin} = useContext(RaffleContext)

    const [dbError, setDbError] = useState(null)
    const [dbLoaded, setDbLoaded] = useState(false)
    const [allRaffleEntries, setallRaffleEntries] = useState([])

    // ENTRIES SUBSCRIPTION (stable onSnapshot managed by effect)
    const [entriesLoaded, setEntriesLoaded] = useState(false)
    const subscribedEntries = useCallback(() => allRaffleEntries, [allRaffleEntries])

    useEffect(() => {
        if (!(authLoaded && isLoggedIn && !!user && raffleAdmin)) {
            setEntriesLoaded(false)
            setallRaffleEntries([])
            return
        }
        const q = query(collection(db, 'raffle-entries'), where('status', '!=', 'deleted'))
        const unsubscribe = onSnapshot(q, querySnapshot => {
            const entries = []
            querySnapshot.forEach(docSnap => {
                entries.push({...docSnap.data(), id: docSnap.id})
            })
            setallRaffleEntries(entries)
            setEntriesLoaded(true)
            setDbLoaded(true)
            console.log('DB, subscribedEntries, entry count:', entries.length)
        }, error => {
            console.error('Error listening to DB:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem reading the raffle entries. They will be unavailable until you refresh the page. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => location.reload()}>Refresh</Button>
            })
        })
        return () => unsubscribe()
    }, [authLoaded, isLoggedIn, raffleAdmin, user])

    const getSummary = useCallback((entries) => {
        let summary = entries
            .sort((a, b) => a.createdAt && b.createdAt ? dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf() : 0)
            .reduce((acc, entry) => {
                if (!entry || entry.status !== 'approved') return acc
                acc.totalEntries = (acc.totalEntries || 0) + 1
                acc.totalDonations = (acc.totalDonations || 0) + (entry.totalDonation || 0)
                acc.totalTickets = (acc.totalTickets || 0) + (entry.allocatedTickets || 0)

                const date = entry.createdAt ? dayjs(entry.createdAt).format('YYYY-MM-DD') : 'unknown'
                setDeepAdd(acc, ['entriesByDate', date, 'totalEntries'], 1)
                setDeepAdd(acc, ['entriesByDate', date, 'totalTickets'], entry.allocatedTickets || 0)
                setDeepAdd(acc, ['entriesByDate', date, 'totalDonations'], entry.totalDonation || 0)
                setDeepAdd(acc, ['cumulativeDonations'], entry.totalDonation || 0)
                setDeep(acc, ['entriesByDate', date, 'cumulativeDonations'], acc.cumulativeDonations || 0)
                setDeepUnique(acc, ['uniqueDonors'], `${entry.username}|${entry.platform}`)
                setDeep(acc, ['entriesByDate', date, 'cumulativeUniqueDonors'], acc.uniqueDonors.length || 0)
                setDeepUnique(acc, ['entriesByDate', date, 'uniqueDonors'], `${entry.username}|${entry.platform}`)
                setDeep(acc, ['entriesByDate', date, 'uniqueDonorCount'], acc.entriesByDate[date].uniqueDonors.length || 0)

                acc.redditDonations = (acc.redditDonations || 0) + (entry.platform === 'Reddit' ? entry.totalDonation : 0)
                acc.discordDonations = (acc.discordDonations || 0) + (entry.platform === 'Discord' ? entry.totalDonation : 0)
                entry.donations.forEach(donation => {
                    setDeepAdd(acc, ['charities', [donation.charity.itemId], 'totalDonations'], donation.amount)
                    setDeepUnique(acc, ['charities', [donation.charity.itemId], 'uniqueDonors'], `${entry.username}|${entry.platform}`)
                }, [])
                entry.pots.forEach(pot => {
                    setDeepAdd(acc, ['pots', [pot.itemId], 'totalTickets'], pot.tickets)
                    setDeepUnique(acc, ['pots', [pot.itemId], 'uniqueDonors'], `${entry.username}|${entry.platform}`)
                    //if (winnerData[pot.itemId]) setDeep(acc, ['pots', [pot.itemId], 'winners'], winnerData[pot.itemId])
                }, [])
                return acc
            }, {})

        // compute multipleWinners list from winnerCounts (two or more)
        const multipleWinners = Object.entries(summary.winnerCounts || {})
            .filter(([, count]) => (count || 0) >= 2)
            .map(([key]) => key)

        // delete identifying info from summary
        summary.uniqueDonorCount = summary.uniqueDonors.length || 0
        delete summary.uniqueDonors

        Object.keys(summary.charities).map(charityId => {
            summary.charities[charityId].uniqueDonorCount = summary.charities[charityId].uniqueDonors.length || 0
            delete summary.charities[charityId].uniqueDonors
        })
        Object.keys(summary.pots).map(potId => {
            summary.pots[potId].uniqueDonorCount = summary.pots[potId].uniqueDonors.length || 0
            delete summary.pots[potId].uniqueDonors
        })
        Object.keys(summary.entriesByDate).map(date => {
            delete summary.entriesByDate[date].uniqueDonors
        })

        summary = {
            charities: {},
            pots: {},
            entriesByDate: {},
            totalEntries: 0,
            totalDonations: 0,
            totalTickets: 0,
            ...summary,
            multipleWinners
        }
        summary.updatedAt = dayjs().toISOString()
        return summary
    }, [])

    const updateRaffleEntry = useCallback(async (entry, snackbar = true) => {
        if (dbError || !(authLoaded && isLoggedIn && raffleAdmin)) return false
        if (!entry || !entry.id) throw new Error('updateRaffleEntry requires an entry with an id')
        const {id, fuzzy, ...rest} = entry
        const clean = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined))
        clean.updatedAt = dayjs().toISOString()
        const ref = doc(db, 'raffle-entries', id)
        try {
            await setDoc(ref, clean, {merge: true})
            snackbar && enqueueSnackbar('RAFL Entry Updated.')
        } catch (error) {
            console.error('Error listening to DB:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem saving the raffle entry. Please try refreshing the page. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => location.reload()}>Refresh</Button>
            })
        }
        return true
    }, [authLoaded, isLoggedIn, raffleAdmin, dbError])


    const updateRaffleWinners = useCallback(async (potId, winners, snackbar = true) => {
        if (dbError || !(authLoaded && isLoggedIn && raffleAdmin)) return false
        const ref = doc(db, 'data-cache', 'raffle-winners')
        try {
            await setDoc(ref, {[potId]: winners}, {merge: true})
            snackbar && enqueueSnackbar('RAFL Winners Updated.')
        } catch (error) {
            console.error('Error listening to DB:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem saving the raffle winners. Please try refreshing the page. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => location.reload()}>Refresh</Button>
            })
        }
        return true
    }, [authLoaded, isLoggedIn, raffleAdmin, dbError])


    const deleteRaffleEntry = useCallback(async (entry) => {

        // TODO: update winner data to remove this entry if it's a winner

        if (dbError || !(authLoaded && isLoggedIn && raffleAdmin)) return false
        if (!entry || !entry.id) throw new Error('deleteRaffleEntry requires an entry with an id')
        const ref = doc(db, 'raffle-entries', entry.id)
        try {
            await deleteDoc(ref)
            enqueueSnackbar('RAFL Entry Deleted.')
            return true
        } catch (error) {
            console.error('Error deleting raffle entry:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem deleting the raffle entry. Please try refreshing the page. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => location.reload()}>Refresh</Button>
            })
            return false
        }
    }, [authLoaded, isLoggedIn, raffleAdmin, dbError])

    const saveSummary = useCallback(async () => {
        if (dbError || !(authLoaded && isLoggedIn && raffleAdmin) || !entriesLoaded) return false
        const ref = doc(db, 'data-cache', 'raffle-entries-summary')
        await setDoc(ref, getSummary(allRaffleEntries))
    }, [allRaffleEntries, authLoaded, dbError, entriesLoaded, getSummary, isLoggedIn, raffleAdmin])

    const initialSummarySavedRef = useRef(false)
    useEffect(() => {
        if (!entriesLoaded) return
        if (!initialSummarySavedRef.current) {
            initialSummarySavedRef.current = true
            return
        }
        // save summary whenever entries change after the initial load
        saveSummary().catch(e => console.error('Error saving summary:', e))
    }, [allRaffleEntries, entriesLoaded, saveSummary, winnerData])

    // value & provider
    const value = useMemo(() => ({
        ...globalContext,
        subscribedEntries,
        dbLoaded,
        entriesLoaded,
        saveSummary,
        profile,
        allRaffleEntries,
        updateRaffleEntry,
        deleteRaffleEntry,
        updateRaffleWinners
    }), [
        globalContext,
        subscribedEntries,
        dbLoaded,
        entriesLoaded,
        saveSummary,
        profile,
        allRaffleEntries,
        updateRaffleEntry,
        deleteRaffleEntry,
        updateRaffleWinners
    ])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
