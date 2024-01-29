import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {doc, arrayUnion, arrayRemove, onSnapshot, runTransaction, getDoc} from 'firebase/firestore'
import AuthContext from './AuthContext'
import {enqueueSnackbar} from 'notistack'

const DBContext = React.createContext({})

export function DBProvider({children}) {
    const {isLoggedIn, user} = useContext(AuthContext)
    const [lockCollection, setLockCollection] = useState({})
    const [dbError, setDbError] = useState(null)

    const addToLockCollection = useCallback(async (key, entryId) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', user.uid)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (!sfDoc.exists()) {
                transaction.set(ref, {
                    [key]: [entryId]
                })
            } else {
                transaction.update(ref, {
                    [key]: arrayUnion(entryId)
                })
            }
        })
    }, [dbError, user])

    const removeFromLockCollection = useCallback(async (key, entryId) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', user.uid)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (!sfDoc.exists()) {
                transaction.set(ref, {
                    [key]: [entryId]
                })
            } else {
                transaction.update(ref, {
                    [key]: arrayRemove(entryId)
                })
            }
        })
    }, [dbError, user])

    const getProfile = useCallback(async userId => {
        const ref = doc(db, 'lockcollections', userId)
        const value = await getDoc(ref)
        return value.data()
    }, [])

    // Lock Collection Subscription
    useEffect(() => {
        if (isLoggedIn) {
            const ref = doc(db, 'lockcollections', user.uid)
            return onSnapshot(ref, async doc => {
                const data = doc.data()
                if (data) {
                    setLockCollection(data)
                } else {
                    setLockCollection({})
                }
            }, error => {
                console.error('Error listening to DB:', error)
                setDbError(true)
                enqueueSnackbar('There was a problem reading your collection. It will be unavailable until you refresh the page. ', {
                    autoHideDuration: null,
                    action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>,
                })
            })
        } else {
            setLockCollection({})
        }
    }, [isLoggedIn, user])

    const value = useMemo(() => ({
        anyCollection: [...new Set([
            ...lockCollection?.own || [],
            ...lockCollection?.picked || [],
            ...lockCollection?.recorded || [],
            ...lockCollection?.wishlist || []
        ])],
        lockCollection,
        addToLockCollection,
        removeFromLockCollection,
        getProfile
    }), [lockCollection, addToLockCollection, removeFromLockCollection, getProfile])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
