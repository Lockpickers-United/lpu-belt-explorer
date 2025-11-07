import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {
    doc,
    onSnapshot,
    collection,
    addDoc
} from 'firebase/firestore'
import AuthContext from '../app/AuthContext'
import dayjs from 'dayjs'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import Button from '@mui/material/Button'

export function DBProviderRaffle({children}) {

    const globalContext = useContext(DBContext)

    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const {profile} = useContext(DBContext)

    const [dbError, setDbError] = useState(null)
    const [dbLoaded, setDbLoaded] = useState(false)

    const createRaffleEntry = useCallback(async (data) => {
        if (dbError || !isLoggedIn) return 'error'
        try {
            const clean = Object.fromEntries(Object.entries(data || {}).filter(([, v]) => v !== undefined))
            clean.pots = (clean.pots || []).reduce((acc, pot) => {
                const existing = acc.find(p => p.itemId === pot.itemId)
                if (!existing) {
                    acc.push({...pot})
                } else {
                    existing.tickets = (existing.tickets || 0) + (pot.tickets || 0)
                }
                return acc
            }, [])
            if (!clean.createdAt) clean.createdAt = dayjs().toISOString()
            clean.updatedAt = dayjs().toISOString()
            clean.raflYear = 2026
            const ref = await addDoc(collection(db, 'raffle-entries'), clean)
            console.log('Created Raffle Entry', clean)
            return ref.id
        } catch (e) {
            console.error('Error creating raffle entry:', e)
            throw e
        }
    }, [dbError, isLoggedIn])

    // SUMMARY SUBSCRIPTION (stable onSnapshot managed by effect)
    const [summaryData, setSummaryData] = useState({})
    const [summaryLoaded, setSummaryLoaded] = useState(false)
    useEffect(() => {
        const docRef = doc(db, 'data-cache', 'raffle-entries-summary')
        const unsubscribe = onSnapshot(docRef, docSnap => {
            const data = docSnap.exists() ? docSnap.data() : null
            setSummaryData(data || {})
            setSummaryLoaded(true)
            setDbLoaded(true)
            console.log('DB, raffle summary loaded')
        }, error => {
            console.error('Error listening to DB:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem reading raffle data. It will be unavailable until you refresh the page. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => location.reload()}>Refresh</Button>
            })
        })
        return () => unsubscribe()
    }, [authLoaded, isLoggedIn, user])

    // WINNERS SUBSCRIPTION
    // TODO - make this only load after raffle is over
    const [winnerData, setWinnerData] = useState({})
    const [winnersLoaded, setWinnersLoaded] = useState(false)
    useEffect(() => {
        const docRef = doc(db, 'data-cache', 'raffle-winners')
        const unsubscribe = onSnapshot(docRef, docSnap => {
            const data = docSnap.exists() ? docSnap.data() : null
            setWinnerData(data || {})
            setWinnersLoaded(true)
            setDbLoaded(true)
            console.log('DB, raffle winners loaded')
        }, error => {
            console.error('Error listening to DB:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem reading raffle data. It will be unavailable until you refresh the page. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => location.reload()}>Refresh</Button>
            })
        })
        return () => unsubscribe()
    }, [authLoaded, isLoggedIn, user])

    // value & provider
    const value = useMemo(() => ({
        ...globalContext,
        testEntry,
        createRaffleEntry,
        dbLoaded,
        profile,
        summaryData,
        summaryLoaded,
        winnerData,
        winnersLoaded,
        dbError
    }), [globalContext, createRaffleEntry, dbLoaded, profile, summaryData, summaryLoaded, winnerData, winnersLoaded, dbError])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext

const testEntry = {
    'platform': 'Discord',
    'username': 'MacGuffin Security',
    'belt': 'Yellow',
    'donations': [
        {
            'amount': 123,
            'receipt': 'https://lpubelts.com/',
            'charity': {
                'itemFullTitle': 'American Humane',
                'itemTitle': 'American Humane',
                'itemId': 'ch_AmHum'
            }
        }
    ],
    'pots': [
        {
            'tickets': 123,
            'itemFullTitle': 'Pot 1 - $$$ of Locc',
            'itemTitle': '$$$ of Locc',
            'itemId': '2025-025',
            'itemPotNumber': '1',
            'itemIndex': 0
        }
    ],
    'totalDonation': 123,
    'allocatedTickets': 123,
    'status': 'pending',
    'dev': true,
    'adminEntry': true
}
