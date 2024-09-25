import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {
    doc,
    arrayUnion,
    arrayRemove,
    onSnapshot,
    runTransaction,
    getDoc,
    getDocs,
    updateDoc,
    deleteField,
    writeBatch,
    addDoc,
    setDoc,
    deleteDoc,
    query,
    collection,
    where,
    Timestamp
} from 'firebase/firestore'
import AuthContext from './AuthContext'
import {enqueueSnackbar} from 'notistack'
import calculateScoreForUser from '../scorecard/scoring'
import {isLock, isProject} from '../entries/entryutils'
import collectionOptions from '../data/collectionTypes'

const DBContext = React.createContext({})

function evidenceDB2State(id, dbRec) {
    const dateStr = dbRec.evidenceCreatedAt && dbRec.evidenceCreatedAt.toDate().toJSON()

    return {
        id: id,
        userId: dbRec.userId,
        matchId: dbRec.projectId,
        evidenceNotes: dbRec.evidenceNotes,
        link: dbRec.evidenceUrl,
        date: dateStr,
        modifier: dbRec.modifier,
        collectionDB: dbRec.collectionDB ? dbRec.collectionDB : 'evidence'
    }
}

function profileDB2State(dbRec) {
    if (dbRec) {
        const additionalFields = Object.keys(collectionOptions).reduce((acc, type) => {
            const anyKey = collectionOptions[type].map.find(c => c.entry === 'system:any').key
            const valKeys = collectionOptions[type].map.filter(c => c.entry !== 'system:any').map(c => c.key)
            acc[anyKey] = [...new Set(valKeys.map(k => dbRec[k]).filter(k => k).flat())]
            return acc
        }, {})

        return {...dbRec, ...additionalFields}
    } else {
        return dbRec
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
        const evidence = querySnapshot.docs.map(rec => evidenceDB2State(rec.id, rec.data()))

        const q2 = query(collection(db, 'awards'), where('userId', '==', userId))
        const querySnapshot2 = await getDocs(q2)
        const awards = querySnapshot2.docs.map(rec => evidenceDB2State(rec.id, rec.data()))

        await setDoc(docRef, {payload: JSON.stringify([...evidence, ...awards])})
        return [...evidence, ...awards]
    }
}

export function DBProvider({children}) {
    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const [lockCollection, setLockCollection] = useState({})
    const [evidence, setEvidence] = useState([])
    const [collectionDBLoaded, setCollectionDBLoaded] = useState(false)
    const [evidenceDBLoaded, setEvidenceDBLoaded] = useState(false)
    const [dbError, setDbError] = useState(null)
    const [systemMessages, setSystemMessages] = useState([])

    const dbLoaded = collectionDBLoaded && evidenceDBLoaded
    const adminRole = isLoggedIn && lockCollection && lockCollection.admin

    const invalidateEvidenceCache = useCallback(async (userId) => {
        const queryStr = `evidence: userId == ${userId}`
        await deleteDoc(doc(db, 'query-cache', queryStr))
    },[])

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

    const updateProfileDisplayName = useCallback(async (displayName) => {
        const ref = doc(db, 'lockcollections', user.uid)
        if (displayName) {
            await setDoc(ref, {displayName}, {merge: true})
        } else {
            await updateDoc(ref, {displayName: deleteField()})
        }
    }, [user])

    const updateUserStatistics = useCallback(async (userId) => {
        const evids = await evidenceCache(userId)
        const scored = calculateScoreForUser(evids)
        const recordedLocks = scored.scoredEvidence.filter(e => isLock(e.matchId)).map(e => e.matchId)
        const projects = scored.scoredEvidence.filter(e => isProject(e.matchId)).map(e => e.matchId)
        const ref = doc(db, 'lockcollections', userId)
        await setDoc(ref, {
            danPoints: scored.danPoints,
            blackBeltCount: scored.bbCount,
            danLevel: scored.eligibleDan,
            recordedLocks: recordedLocks,
            projects: projects
        }, {merge: true})
    }, [])

    const updateProfileBlackBeltAwardedAt = useCallback(async (userId, date) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', userId)
        await updateDoc(ref, {blackBeltAwardedAt: Timestamp.fromDate(new Date(date))})
    }, [dbError])

    const removeProfileBlackBeltAwarded = useCallback(async (userId) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', userId)
        await updateDoc(ref, {blackBeltAwardedAt: deleteField(), tabClaimed: deleteField(), awardedBelt: deleteField()})
    }, [dbError])

    const getProfile = useCallback(async userId => {
        const ref = doc(db, 'lockcollections', userId)
        const value = await getDoc(ref)
        return profileDB2State(value.data())
    }, [])

    const addEvidence = useCallback(async (userId, evid) => {
        const rec = {
            userId: userId,
            projectId: evid.matchId,
            evidenceNotes: evid.evidenceNotes,
            evidenceUrl: evid.link,
            evidenceCreatedAt: Timestamp.fromDate(new Date(evid.date)),
            modifier: evid.modifier,
            collectionDB: evid.collectionDB
        }
        const collectionDB = evid.collectionDB
        const docRef = await addDoc(collection(db, collectionDB), rec)
        await invalidateEvidenceCache(userId)
        await updateUserStatistics(userId)

        if (user.uid === userId) {
            setEvidence(e => e.concat(evidenceDB2State(docRef.id, rec)))
        }
    }, [user, updateUserStatistics, invalidateEvidenceCache])

    const updateEvidence = useCallback(async (oldEvid, newEvid) => {
        let rec = {
            userId: oldEvid.userId,
            evidenceNotes: newEvid.evidenceNotes,
            evidenceUrl: newEvid.link,
            evidenceCreatedAt: Timestamp.fromDate(new Date(newEvid.date)),
            modifier: newEvid.modifier,
            collectionDB: oldEvid.collectionDB
        }
        if (newEvid.matchId) {
            rec.projectId = newEvid.matchId
        }
        const collectionName = oldEvid.collectionDB
        await setDoc(doc(db, collectionName, oldEvid.id), rec)
        await invalidateEvidenceCache(oldEvid.userId)
        await updateUserStatistics(oldEvid.userId)

        if (user.uid === oldEvid.userId) {
            setEvidence(e => e.map(evid => {
                if (evid.id === oldEvid.id) {
                    return evidenceDB2State(oldEvid.id, rec)
                } else {
                    return evid
                }
            }))
        }
    }, [user, updateUserStatistics, invalidateEvidenceCache])

    const removeEvidence = useCallback(async (evids) => {
        if (Array.isArray(evids)) {
            const batch = writeBatch(db)
            evids.forEach(ev => {
                const collectionName = ev.collectionDB
                batch.delete(doc(db, collectionName, ev.id))
            })
            await batch.commit()

            const userIds = evids.reduce((acc, ev) => {
                return acc.includes(ev.userId) ? acc : [...acc, ev.userId]
            }, [])
            for (let idx = 0; idx < userIds.length; idx++) {
                await invalidateEvidenceCache(userIds[idx])
                await updateUserStatistics(userIds[idx])
            }

            const currentIds = evids.filter(ev => ev.userId === user.uid).map(ev => ev.id)
            if (currentIds.length > 0) {
                setEvidence(e => e.filter(ev => !currentIds.includes(ev.id)))
            }
        } else {
            const collectionName = evids.collectionDB
            await deleteDoc(doc(db, collectionName, evids.id))
            await invalidateEvidenceCache(evids.userId)
            await updateUserStatistics(evids.userId)
            if (user.uid === evids.userId) {
                setEvidence(e => e.filter(ev => evids.id !== ev.id))
            }
        }
    }, [user, updateUserStatistics, invalidateEvidenceCache])

    const getEvidence = useCallback(async userId => {
        return await evidenceCache(userId)
    }, [])

    const importUnclaimedEvidence = useCallback(async (userId, tabName) => {
        const bbRef = doc(db, 'unclaimed-blackbelts', tabName.trim())
        const profileRef = doc(db, 'lockcollections', userId)
        let beltSet = false

        await runTransaction(db, async transaction => {
            const bbDoc = await transaction.get(bbRef)
            const profileDoc = await transaction.get(profileRef)

            if (bbDoc.exists()) {
                const dateStr = bbDoc.data().awardedAt

                const profileDelta = {
                    awardedBelt: 'Black',
                    tabClaimed: tabName.trim(),
                    blackBeltAwardedAt: Timestamp.fromDate(new Date(dateStr))
                }
                if (!profileDoc.exists()) {
                    transaction.set(profileRef, profileDelta)
                } else {
                    transaction.update(profileRef, profileDelta)
                }
                transaction.update(bbRef, {claimed: true})
                beltSet = true
            }
        })

        if (beltSet) {
            const q = query(collection(db, 'unclaimed-evidence'), where('tabName', '==', tabName.trim()))
            const querySnapshot = await getDocs(q)
            const newEvidence = querySnapshot.docs.map(d => d.data())
            const newMatchIds = newEvidence.map(e => e.projectId)
            const toReplace = await evidenceCache(userId)
            const toReplaceIds = toReplace.filter(ev => ev.link === '' && newMatchIds.includes(ev.matchId)).map(ev => ev.id)

            const batch = writeBatch(db)
            let result = []
            toReplaceIds.forEach(id => batch.delete(doc(db, 'evidence', id)))

            newEvidence.forEach(rec => {
                let newDoc = {
                    userId: userId,
                    evidenceNotes: rec.evidenceNotes,
                    evidenceUrl: rec.evidenceUrl,
                    modifier: rec.modifier
                }
                if (rec.projectId) {
                    newDoc.projectId = rec.projectId
                }
                if (rec.evidenceCreatedAt) {
                    newDoc.evidenceCreatedAt = Timestamp.fromDate(new Date(rec.evidenceCreatedAt))
                }
                const docRef = doc(collection(db, 'evidence'))
                batch.set(docRef, newDoc)
                result = result.concat([evidenceDB2State(docRef.id, newDoc)])
            })

            await batch.commit()
            await invalidateEvidenceCache(userId)
            await updateUserStatistics(userId)

            if (user.uid === userId) {
                setEvidence(e => e.filter(ev => !toReplaceIds.includes(ev.id)).concat(result))
            }
        }
        return beltSet
    }, [user, updateUserStatistics, invalidateEvidenceCache])

    const createEvidenceForEntries = useCallback(async (userId, ids) => {
        const batch = writeBatch(db)
        let result = []
        const newDocs = ids.map(matchId => {
            return {
                userId: userId,
                evidenceNotes: '',
                evidenceUrl: '',
                modifier: '',
                projectId: matchId
            }
        })
        newDocs.forEach(newDoc => {
            const docRef = doc(collection(db, 'evidence'))
            batch.set(docRef, newDoc)
            result = result.concat([evidenceDB2State(docRef.id, newDoc)])
        })
        await batch.commit()
        await invalidateEvidenceCache(userId)
        await updateUserStatistics(userId)

        if (user.uid === userId) {
            setEvidence(e => e.concat(result))
        }
    }, [user, updateUserStatistics, invalidateEvidenceCache])

    const deleteAllUserData = useCallback(async (userId) => {
        await invalidateEvidenceCache(userId)
        const evids = await evidenceCache(userId)
        await removeEvidence(evids)

        const ref = doc(db, 'lockcollections', userId)
        const profile = (await getDoc(ref)).data()
        let cleanProfile = {}
        if (profile.admin) {
            cleanProfile.admin = profile.admin
        }
        if (profile.displayName) {
            cleanProfile.displayName = profile.displayName
        }
        await setDoc(ref, cleanProfile)
    }, [removeEvidence, invalidateEvidenceCache])

    const oauthState = useCallback(async (state) => {
        if (!user.uid) return false
        const ref = doc(db, 'lockcollections', user.uid)
        if (state) {
            const userDoc = await getDoc(ref)
            const profile = userDoc.data()
            return state === profile?.oauthState
        } else {
            const newState = (Math.random()+1).toString(36).substring(2)
            await setDoc(ref, {oauthState: newState}, {merge: true})
            return newState
        }
    }, [user.uid])

    const getBookmarkForRedditUser = useCallback(async (username) => {
        const ref = doc(db, 'lockcollections', user.uid)
        const userDoc = await getDoc(ref)
        const profile = userDoc.data()
        if (profile && username === profile.redditUsername) {
            return profile.redditBookmark
        } else {
            return null
        }
    }, [user])

    const advanceBookmarkForRedditUser = useCallback(async (username, bookmark, awards) => {
        const batch = writeBatch(db)
        awards.forEach(aw => {
            const newDoc = {
                userId: user.uid,
                awardId: aw.matchId,
                awardUrl: aw.link,
                awardCreatedAt: Timestamp.fromDate(new Date(aw.awardedAt))
            }
            const ref = doc(db, 'awards-reddit', btoa(user.uid + aw.matchId))
            batch.set(ref, newDoc)
        })
        await batch.commit()

        if (username && bookmark) {
            const ref = doc(db, 'lockcollections', user.uid)
            await setDoc(ref, {redditUsername: username, redditBookmark: bookmark}, {merge: true})
        }
    }, [user])

    const setDiscordUserInfo = useCallback(async (id, username) => {
        if (id && username) {
            const ref = doc(db, 'lockcollections', user.uid)
            await setDoc(ref, {discordId: id, discordUsername: username}, {merge: true})
        }
    }, [user])

    // Lock Collection Subscription
    useEffect(() => {
        if (isLoggedIn) {
            const ref = doc(db, 'lockcollections', user.uid)
            return onSnapshot(ref, async doc => {
                const data = doc.data()
                if (data) {
                    const toSet = profileDB2State(data)
                    setLockCollection(toSet)
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

    // System Messages Subscription
    useEffect(() => {
        const q = query(collection(db, 'system-messages'), where('status', '==', 'active'))
        return onSnapshot(q, querySnapshot => {
            setSystemMessages(querySnapshot.docs.map(doc => doc.data()))
        }, error => {
            console.error('Error getting system messages from DB:', error)
        })
    }, [])

    const getAllSystemMessages = useCallback(async () => {
        const q = query(collection(db, 'system-messages'))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(d => d.data())
    }, [])

    const updateSystemMessage = useCallback(async (message) => {
        if (dbError) return false
        const ref = doc(db, 'system-messages', message.id)
        await setDoc(ref, message)
    }, [dbError])

    const updateSystemMessageStatus = useCallback(async (messageId, status, timeStamp) => {
        if (dbError) return false
        const ref = doc(db, 'system-messages', messageId)
        await updateDoc(ref, {status: status, modified: timeStamp})
    }, [dbError])

    const removeDismissedMessages = useCallback(async (userId) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', userId)
        await updateDoc(ref, {dismissedMessages: deleteField()})
    }, [dbError])

    const value = useMemo(() => ({
        dbLoaded,
        adminRole,
        lockCollection,
        addToLockCollection,
        removeFromLockCollection,
        getProfile,
        updateProfileDisplayName,
        updateProfileBlackBeltAwardedAt,
        removeProfileBlackBeltAwarded,
        updateUserStatistics,
        evidence,
        addEvidence,
        updateEvidence,
        removeEvidence,
        getEvidence,
        importUnclaimedEvidence,
        createEvidenceForEntries,
        deleteAllUserData,
        oauthState,
        getBookmarkForRedditUser,
        advanceBookmarkForRedditUser,
        setDiscordUserInfo,
        systemMessages,
        getAllSystemMessages,
        updateSystemMessage,
        updateSystemMessageStatus,
        removeDismissedMessages,
        invalidateEvidenceCache
    }), [dbLoaded,
        adminRole,
        lockCollection,
        addToLockCollection,
        removeFromLockCollection,
        getProfile,
        updateProfileDisplayName,
        updateProfileBlackBeltAwardedAt,
        removeProfileBlackBeltAwarded,
        updateUserStatistics,
        evidence,
        addEvidence,
        updateEvidence,
        removeEvidence,
        getEvidence,
        importUnclaimedEvidence,
        createEvidenceForEntries,
        deleteAllUserData,
        oauthState,
        getBookmarkForRedditUser,
        advanceBookmarkForRedditUser,
        setDiscordUserInfo,
        systemMessages,
        getAllSystemMessages,
        updateSystemMessage,
        updateSystemMessageStatus,
        removeDismissedMessages,
        invalidateEvidenceCache
        ])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
