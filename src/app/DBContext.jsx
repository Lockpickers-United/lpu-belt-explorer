import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {doc, arrayUnion, arrayRemove, onSnapshot, runTransaction, getDoc, getDocs, deleteField, addDoc, setDoc, deleteDoc, query, collection, where, Timestamp} from 'firebase/firestore'
import AuthContext from './AuthContext'
import {enqueueSnackbar} from 'notistack'

const DBContext = React.createContext({})

function evidenceDB2State(id, dbRec) {
    const dateStr = dbRec.evidCreatedAt && dbRec.evidCreatedAt.toDate().toJSON()

    return {
        id: id,
        matchId: dbRec.lockProjectId,
        name: dbRec.evidName,
        link: dbRec.evidUrl,
        date: dateStr,
        modifier: dbRec.modifier
    }
}

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
        const rec = {
            userId: user.uid, 
            lockProjectId: evid.matchId,
            evidName: evid.name,
            evidUrl: evid.link,
            evidCreatedAt: Timestamp.fromDate(new Date(evid.date)),
            modifier: evid.modifier
        }
        const docRef = await addDoc(collection(db, 'evidence'), rec)
        setEvidence(e => e.concat(evidenceDB2State(docRef.id, rec)))
    }, [user])

    const updateEvidence = useCallback(async (id, evid) => {
        const rec = {
            userId: user.uid,
            lockProjectId: evid.matchId,
            evidName: evid.name,
            evidUrl: evid.link,
            evidCreatedAt: Timestamp.fromDate(new Date(evid.date)),
            modifier: evid.modifier
        }
        await setDoc(doc(db, 'evidence', id), rec)
        setEvidence(e => e.map(evid => {
            if (evid.id === id) {
                return evidenceDB2State(id, rec)
            } else {
                return evid
            }
        }))
    }, [user])

    const removeEvidence = useCallback(async (id) => {
        await deleteDoc(doc(db, 'evidence', id))
        setEvidence(e => e.filter(evid => evid.id !== id))
    }, [])

    const getEvidence = useCallback(async userId => {
        const q = query(collection(db, 'evidence'), where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(rec => evidenceDB2State(rec.id, rec.data()))
    }, [])

    const importUnclaimedEvidence = useCallback(async (tabName) => {
        const q = query(collection(db, 'unclaimed-evidence'), where('tabName', '==', tabName))
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs

        for (let idx=0; idx < docs.length; idx++) {
            const rec = docs[idx].data()
            let newDoc = {
                userId: user.uid,
                evidName: rec.evidName,
                evidUrl: rec.evidUrl,
                modifier: rec.modifier
            }
            if (rec.lockProjectId) {
                newDoc.lockProjectId = rec.lockProjectId
            }
            if (rec.evidCreatedAt) {
                newDoc.evidCreatedAt = Timestamp.fromDate(new Date(rec.evidCreatedAt))
            }
            const docRef = await addDoc(collection(db, 'evidence'), newDoc)
            setEvidence(e => e.concat([evidenceDB2State(docRef.id, newDoc)]))
        }
    }, [user])

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
                console.error('Error listening to DB:', error)
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

    // Evidence Load
    useEffect(() => {
        async function loadEvidence() {
            if (isLoggedIn) {
                const q = query(collection(db, 'evidence'), where('userId', '==', user.uid))
                const querySnapshot = await getDocs(q)
                setEvidence(querySnapshot.docs.map(rec => evidenceDB2State(rec.id, rec.data())))
                setEvidenceDBLoaded(true)
            } else if (authLoaded) {
                setEvidence([])
                setEvidenceDBLoaded(true)
            }
        }
        loadEvidence()
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
        getEvidence,
        importUnclaimedEvidence
    }), [dbLoaded, lockCollection, addToLockCollection, removeFromLockCollection, getProfile, updateProfileVisibility, clearProfile, evidence, addEvidence, updateEvidence, removeEvidence, getEvidence, importUnclaimedEvidence])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
