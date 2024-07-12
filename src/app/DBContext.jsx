import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {doc, arrayUnion, arrayRemove, onSnapshot, runTransaction, getDoc, getDocs, deleteField, addDoc, setDoc, deleteDoc, query, collection, where, Timestamp} from 'firebase/firestore'
import AuthContext from './AuthContext'
import {enqueueSnackbar} from 'notistack'

const DBContext = React.createContext({})

export function DBProvider({children}) {
    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const [lockCollection, setLockCollection] = useState({})
    const [evidence, setEvidence] = useState([])
    const [collectionDBLoaded, setCollectionDBLoaded] = useState(false)
    const [evidenceDBLoaded, setEvidenceDBLoaded] = useState(false)
    const [dbError, setDbError] = useState(null)

    const dbLoaded = collectionDBLoaded && evidenceDBLoaded

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

    const updateProfileVisibility = useCallback(async (visibility, displayName) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', user.uid)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            const delta = {public: visibility, displayName}
            if (!sfDoc.exists()) {
                transaction.set(ref, delta)
            } else {
                transaction.update(ref, delta)
            }
        })
    }, [dbError, user])

    const clearProfile = useCallback(async () => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', user.uid)
        await runTransaction(db, async transaction => {
            transaction.update(ref, {
                displayName: deleteField(),
                public: deleteField()
            })
        })
    }, [dbError, user])

    const getProfile = useCallback(async userId => {
        const ref = doc(db, 'lockcollections', userId)
        const value = await getDoc(ref)
        return value.data()
    }, [])

    const addEvidence = useCallback(async evid => {
        if (dbError) return false
        await addDoc(collection(db, 'evidence'), {
            userId: user.uid,
            lockProjectId: evid.matchId,
            evidName: evid.name,
            evidUrl: evid.link,
            evidCreatedAt: Timestamp.fromDate(new Date(evid.date)),
            modifier: evid.modifier
        })
    }, [dbError, user])

    const updateEvidence = useCallback(async (id, evid) => {
        if (dbError) return false
        await setDoc(doc(db, 'evidence', id), {
            userId: user.uid,
            lockProjectId: evid.matchId,
            evidName: evid.name,
            evidUrl: evid.link,
            evidCreatedAt: Timestamp.fromDate(new Date(evid.date)),
            modifier: evid.modifier
        })
    }, [dbError, user])

    const removeEvidence = useCallback(async (id) => {
        if (dbError) return false
        await deleteDoc(doc(db, 'evidence', id))
    }, [dbError])

    const importUnclaimedEvidence = useCallback(async (tabName) => {
        if (dbError) return false
        const q = query(collection(db, 'unclaimed-evidence'), where('tabName', '==', tabName))
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs

        for (let idx=0; idx < docs.length; idx++) {
            const rec = docs[idx].data()
            let newRec = {
                userId: user.uid,
                evidName: rec.evidName,
                evidUrl: rec.evidUrl,
                modifier: rec.modifier
            }
            if (rec.lockProjectId) {
                newRec.lockProjectId = rec.lockProjectId
            }
            if (rec.evidCreatedAt) {
                newRec.evidCreatedAt = Timestamp.fromDate(new Date(rec.evidCreatedAt))
            }
            await addDoc(collection(db, 'evidence'), newRec)
        }
    }, [dbError, user])

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
                setCollectionDBLoaded(true)
            }, error => {
                console.error('Error listening to collection DB:', error)
                setDbError(true)
                enqueueSnackbar('There was a problem reading your collection. It will be unavailable until you refresh the page. ', {
                    autoHideDuration: null,
                    action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
                })
            })
        } else if (authLoaded) {
            setLockCollection({})
            setCollectionDBLoaded(true)
        }
    }, [authLoaded, isLoggedIn, user])

    // Evidence Subscription
    useEffect(() => {
        if (isLoggedIn) {
            const q = query(collection(db, 'evidence'), where('userId', '==', user.uid))
            return onSnapshot(q, async querySnapshot => {
                setEvidence(querySnapshot.docs.map(doc => {
                    const data = doc.data()
                    const dateStr = data.evidCreatedAt && data.evidCreatedAt.toDate().toJSON()

                    return {
                        id: doc.id,
                        matchId: data.lockProjectId,
                        name: data.evidName,
                        link: data.evidUrl,
                        date: dateStr,
                        modifier: data.modifier
                    }
                }))
                setEvidenceDBLoaded(true)
            }, error => {
                console.error('Error listening to evidence DB:', error)
                setDbError(true)
                enqueueSnackbar('There was a problem reading your evidence. It will be unavailable until you refresh the page. ', {
                    autoHideDuration: null,
                    action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
                })
            })
        } else if (authLoaded) {
            setEvidence([])
            setEvidenceDBLoaded(true)
        }
    }, [authLoaded, isLoggedIn, user])

    const value = useMemo(() => ({
        dbLoaded,
        lockCollection,
        addToLockCollection,
        removeFromLockCollection,
        getProfile,
        updateProfileVisibility,
        clearProfile,
        evidence,
        addEvidence,
        updateEvidence,
        removeEvidence,
        importUnclaimedEvidence
    }), [dbLoaded, lockCollection, addToLockCollection, removeFromLockCollection, getProfile, updateProfileVisibility, clearProfile, evidence, addEvidence, updateEvidence, removeEvidence, importUnclaimedEvidence])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
