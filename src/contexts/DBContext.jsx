import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {doc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot} from 'firebase/firestore'
import AuthContext from './AuthContext'

const DBContext = React.createContext({})

export function DBProvider({children}) {
    const {isLoggedIn, user} = useContext(AuthContext)
    const [lockCollection, setLockCollection] = useState({})

    const addToLockCollection = useCallback(async (key, entryId) => {
        await updateDoc(doc(db, 'lockcollections', user.uid), {
            [key]: arrayUnion(entryId)
        })
    }, [user])

    const removeFromLockCollection = useCallback(async (key, entryId) => {
        await updateDoc(doc(db, 'lockcollections', user.uid), {
            [key]: arrayRemove(entryId)
        })
    }, [user])

    // Lock Collection Subscription
    useEffect(() => {
        if (isLoggedIn) {
            const ref = doc(db, 'lockcollections', user.uid)
            return onSnapshot(ref, doc => {
                const data = doc.data()
                if (data) {
                    setLockCollection(data)
                } else {
                    return setDoc(ref, {})
                }
            })
        } else {
            setLockCollection({})
        }
    }, [isLoggedIn, user])

    const value = useMemo(() => ({
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
