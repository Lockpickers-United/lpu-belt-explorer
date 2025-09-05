import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {db} from '../../auth/firebase'
import {
    doc,
    onSnapshot,
    runTransaction,
    getDocs,
    getDoc,
    collection,
    query,
    where,
    deleteDoc,
    addDoc, setDoc
} from 'firebase/firestore'
import AuthContext from '../../app/AuthContext'
import {enqueueSnackbar} from 'notistack'
import dayjs from 'dayjs'
import DBContextRaffle from '../DBContextRaffle.jsx'
import DBContext from '../../app/DBContext.jsx'
import RaffleContext from '../RaffleContext.jsx'
import {setDeepAdd, setDeepUnique} from '../../util/setDeep'

export function RaffleAdminDBProvider({children}) {

    const globalContext = useContext(DBContextRaffle)

    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const {profile} = useContext(DBContext)
    const {raffleAdmin} = useContext(RaffleContext)

    const [dbError, setDbError] = useState(null)
    const [dbLoaded, setDbLoaded] = useState(false)

    const [allEntries, setAllEntries] = useState([])

    // ENTRIES SUBSCRIPTION (stable onSnapshot managed by effect)
    const [entriesLoaded, setEntriesLoaded] = useState(false)
    const subscribedEntries = useCallback(() => allEntries, [allEntries])

    useEffect(() => {
        if (!(authLoaded && isLoggedIn && !!user && raffleAdmin)) {
            setEntriesLoaded(false)
            setAllEntries([])
            return
        }
        const q = query(collection(db, 'raffle-entries'), where('status', '!=', 'deleted'))
        const unsubscribe = onSnapshot(q, querySnapshot => {
            const entries = []
            querySnapshot.forEach(docSnap => {
                entries.push({...docSnap.data(), id: docSnap.id})
            })
            setAllEntries(entries)
            setEntriesLoaded(true)
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
       let summary = entries.reduce((acc, entry) => {
            if (!entry || entry.status !== 'approved') return acc
            acc.totalEntries = (acc.totalEntries || 0) + 1
            acc.totalDonations = (acc.totalDonations || 0) + (entry.totalDonation || 0)
            acc.totalTickets = (acc.totalTickets || 0) + (entry.allocatedTickets || 0)
            setDeepUnique(acc, ['uniqueDonors'], `${entry.username}|${entry.platform}`)
            entry.donations.forEach(donation => {
                setDeepAdd(acc, ['charities', [donation.charity.itemId], 'totalDonations'], donation.amount)
                setDeepUnique(acc, ['charities', [donation.charity.itemId], 'uniqueDonors'], `${entry.username}|${entry.platform}`)
            }, [])
            entry.pots.forEach(pot => {
                setDeepAdd(acc, ['pots', [pot.itemId], 'totalTickets'], pot.tickets)
                setDeepAdd(acc, ['pots', [pot.itemId], 'uniqueDonors'], `${entry.username}|${entry.platform}`)
            }, [])
            return acc
        }, {})
        summary = {
            charities: {},
            pots: {},
            uniqueDonors: [],
            totalEntries: 0,
            totalDonations: 0,
            totalTickets: 0,
            ...summary
        }
        summary.updatedAt = dayjs().toISOString()
        return summary
    }, [])

    const saveSummary = useCallback(async () => {
        if (dbError || !(authLoaded && isLoggedIn && raffleAdmin) || !entriesLoaded) return false
        const ref = doc(db, 'data-cache', 'raffle-entries-summary')
        await setDoc(ref, getSummary(allEntries))
    }, [allEntries, authLoaded, dbError, entriesLoaded, getSummary, isLoggedIn, raffleAdmin])

    
    const initialSummarySavedRef = useRef(false)

    useEffect(() => {
        if (!entriesLoaded) return
        if (!initialSummarySavedRef.current) {
            initialSummarySavedRef.current = true
            return
        }
        // save summary whenever entries change after the initial load
        saveSummary().catch(e => console.error('Error saving summary:', e))
    }, [allEntries, entriesLoaded, saveSummary])

    if (entriesLoaded) console.log('getSummary', getSummary(allEntries))

    const updateRaffleEntry = useCallback(async (entry) => {
        if (dbError || !(authLoaded && isLoggedIn && raffleAdmin)) return false
        if (!entry || !entry.id) throw new Error('updateRaffleEntry requires an entry with an id')
        const {id, ...rest} = entry
        const clean = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined))
        clean.updatedAt = dayjs().toISOString()
        const ref = doc(db, 'raffle-entries', id)
        try {
            await setDoc(ref, clean, {merge: true})
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

    const deleteRaffleEntry = useCallback(async (entry) => {
        if (dbError || !(authLoaded && isLoggedIn && raffleAdmin)) return false
        if (!entry || !entry.id) throw new Error('deleteRaffleEntry requires an entry with an id')
        const ref = doc(db, 'raffle-entries', entry.id)
        try {
            await deleteDoc(ref)
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

    // value & provider
    const value = useMemo(() => ({
        ...globalContext,
        subscribedEntries,
        testValue,
        dbLoaded,
        entriesLoaded,
        saveSummary,
        profile,
        allEntries,
        updateRaffleEntry,
        deleteRaffleEntry
    }), [
        globalContext,
        subscribedEntries,
        dbLoaded,
        entriesLoaded,
        saveSummary,
        profile,
        allEntries,
        updateRaffleEntry,
        deleteRaffleEntry
    ])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext

const testValue = 'testing'
