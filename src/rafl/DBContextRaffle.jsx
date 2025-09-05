import React, {useCallback, useContext, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
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
import AuthContext from '../app/AuthContext'
import dayjs from 'dayjs'
import DBContext from '../app/DBContext.jsx'
import RaffleContext from './RaffleContext.jsx'

export function DBProviderRaffle({children}) {

    const globalContext = useContext(DBContext)

    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const {profile} = useContext(DBContext)
    const {raffleAdmin} = useContext(RaffleContext)

    const [dbError, setDbError] = useState(null)
    const [dbLoaded, setDbLoaded] = useState(false)

    const createRaffleEntry = useCallback(async (data) => {
        console.log('Creating Raffle Entry', data)
        if (dbError || !isLoggedIn) return 'error'
        try {
            const clean = Object.fromEntries(Object.entries(data || {}).filter(([, v]) => v !== undefined))
            if (!clean.createdAt) clean.createdAt = dayjs().toISOString()
            clean.updatedAt = dayjs().toISOString()
            const ref = await addDoc(collection(db, 'raffle-entries'), clean)
            return ref.id
        } catch (e) {
            console.error('Error creating raffle entry:', e)
            throw e
        }
    }, [dbError, isLoggedIn])

    // value & provider
    const value = useMemo(() => ({
        ...globalContext,
        testEntry,
        createRaffleEntry,
        dbLoaded,
        profile,
    }), [
        globalContext,
        createRaffleEntry,
        dbLoaded,
        profile,
    ])

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
