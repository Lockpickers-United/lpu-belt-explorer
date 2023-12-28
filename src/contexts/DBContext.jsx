import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, runTransaction} from 'firebase/firestore'
import AuthContext from './AuthContext'
import {enqueueSnackbar} from 'notistack'

const DBContext = React.createContext({})

export function DBProvider({children}) {
    const {isLoggedIn, user} = useContext(AuthContext)
    const [lockCollection, setLockCollection] = useState({})
    const [dbError, setDbError] = useState(null)

    const addToLockCollection = useCallback(async (key, entryId) => {
        if (dbError) return false
        await updateDoc(doc(db, 'lockcollections', user.uid), {
            [key]: arrayUnion(entryId)
        })
    }, [dbError, user])

    const removeFromLockCollection = useCallback(async (key, entryId) => {
        if (dbError) return false
        await updateDoc(doc(db, 'lockcollections', user.uid), {
            [key]: arrayRemove(entryId)
        })
    }, [dbError, user])

    // Lock Collection Subscription
    useEffect(() => {
        if (isLoggedIn) {
            const ref = doc(db, 'lockcollections', user.uid)
            return onSnapshot(ref, async doc => {
                const data = doc.data()
                if (data) {
                    console.trace('Received DB data update.', data)
                    setLockCollection(data)
                } else {
                    console.trace('Missing DB data, creating new record.')

                    await runTransaction(db, async transaction => {
                        const sfDoc = await transaction.get(ref)
                        if (sfDoc.exists()) {
                            console.error('Error creating new DB record. Record already exists.')
                            setDbError(true)
                            enqueueSnackbar('There was a problem reading your collection. It will be unavailable until you refresh the page. ', {
                                autoHideDuration: null,
                                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>,
                            })
                        }
                        transaction.set(ref, {})
                    })
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
        removeFromLockCollection
    }), [lockCollection, addToLockCollection, removeFromLockCollection])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
