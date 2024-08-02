import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {doc, arrayUnion, arrayRemove, onSnapshot, runTransaction, getDoc, getDocs, deleteField, writeBatch, addDoc, setDoc, deleteDoc, query, collection, where, Timestamp} from 'firebase/firestore'
import AuthContext from './AuthContext'
import {enqueueSnackbar} from 'notistack'

const DBContext = React.createContext({})

function evidenceDB2State(id, dbRec) {
    const dateStr = dbRec.evidCreatedAt && dbRec.evidCreatedAt.toDate().toJSON()

    return {
        id: id,
        matchId: dbRec.lockProjectId,
        evidenceNotes: dbRec.evidName,
        link: dbRec.evidUrl,
        date: dateStr,
        modifier: dbRec.modifier
    }
}

async function evidenceCache(userId) {
    const queryStr = `evidence: userId == ${userId}`
    const docRef = doc(db, 'query-cache', queryStr)
    const cached = await getDoc(docRef)

    if (cached.exists()) {
        return JSON.parse(cached.data().payload)
    } else {
        const q = query(collection(db, 'evidence'), where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        const retval = querySnapshot.docs.map(rec => evidenceDB2State(rec.id, rec.data()))
        await setDoc(docRef, {payload: JSON.stringify(retval)})
        return retval
    }
}

async function invalidateEvidenceCache(userId) {
    const queryStr = `evidence: userId == ${userId}`
    await deleteDoc(doc(db, 'query-cache', queryStr))
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
            evidName: evid.evidenceNotes,
            evidUrl: evid.link,
            evidCreatedAt: Timestamp.fromDate(new Date(evid.date)),
            modifier: evid.modifier
        }
        const docRef = await addDoc(collection(db, 'evidence'), rec)
        await invalidateEvidenceCache(user.uid)
        setEvidence(e => e.concat(evidenceDB2State(docRef.id, rec)))
    }, [user])

    const updateEvidence = useCallback(async (id, evid) => {
        let rec = {
            userId: user.uid,
            evidName: evid.evidenceNotes,
            evidUrl: evid.link,
            evidCreatedAt: Timestamp.fromDate(new Date(evid.date)),
            modifier: evid.modifier
        }
        if (evid.matchId) {
            rec.lockProjectId = evid.matchId
        }
        await setDoc(doc(db, 'evidence', id), rec)
        await invalidateEvidenceCache(user.uid)
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
        await invalidateEvidenceCache(user.uid)
        setEvidence(e => e.filter(evid => evid.id !== id))
    }, [user.uid])

    const removeAllEvidence = useCallback(async () => {
        const batch = writeBatch(db)
        evidence.forEach(evid => batch.delete(doc(db, 'evidence', evid.id)))
        await batch.commit()
        await invalidateEvidenceCache(user.uid)
        setEvidence([])
    }, [evidence, user.uid])

    const getEvidence = useCallback(async userId => {
        return await evidenceCache(userId)
    }, [])

    const importUnclaimedEvidence = useCallback(async (tabName) => {
        const q = query(collection(db, 'unclaimed-evidence'), where('tabName', '==', tabName))
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs
        const batch = writeBatch(db)
        let result = []

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
            const docRef = doc(collection(db, 'evidence'))
            batch.set(docRef, newDoc)
            result = result.concat([evidenceDB2State(docRef.id, newDoc)])
        }
        await batch.commit()
        await invalidateEvidenceCache(user.uid)
        setEvidence(result)
    }, [user])

    const createEvidenceForEntries = useCallback(async (ids) => {
        const batch = writeBatch(db)
        let result = []
        const newDocs = ids.map(matchId => {
            return {
                userId: user.uid,
                evidName: '',
                evidUrl: '',
                modifier: '',
                lockProjectId: matchId,
                evidCreatedAt: Timestamp.fromDate(new Date())
            }
        })
        newDocs.forEach(newDoc => {
            const docRef = doc(collection(db, 'evidence'))
            batch.set(docRef, newDoc)
            result = result.concat([evidenceDB2State(docRef.id, newDoc)])
        })
        await batch.commit()
        await invalidateEvidenceCache(user.uid)
        setEvidence(evidence.concat(result))
    }, [user, evidence])

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
                const evidence = await evidenceCache(user.uid)
                setEvidence(evidence)
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
        removeAllEvidence,
        getEvidence,
        importUnclaimedEvidence,
        createEvidenceForEntries
    }), [dbLoaded, lockCollection, addToLockCollection, removeFromLockCollection, getProfile, updateProfileVisibility, clearProfile, evidence, addEvidence, updateEvidence, removeEvidence, removeAllEvidence, getEvidence, importUnclaimedEvidence, createEvidenceForEntries])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
