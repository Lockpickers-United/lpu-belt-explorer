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
import {
    isLock,
    isProject,
    isAward,
    lookupAwardByBelt,
    blackBeltAwardId,
    getAwardEntryFromId
} from '../entries/entryutils'
import collectionOptions from '../data/collectionTypes'
import isValidUrl from '../util/isValidUrl'

/**
 * @typedef {object} award
 * @prop award.awardType
 * @prop awardType
 */

const DBContext = React.createContext({})

export function DBProvider({children}) {
    const {authLoaded, isLoggedIn, user, userClaims} = useContext(AuthContext)
    const [lockCollection, setLockCollection] = useState({})
    const [pickerActivity, setPickerActivity] = useState([])
    const [collectionDBLoaded, setCollectionDBLoaded] = useState(false)
    const [activityLoaded, setActivityLoaded] = useState(false)
    const [dbError, setDbError] = useState(null)
    const [systemMessages, setSystemMessages] = useState([])

    const dbLoaded = collectionDBLoaded && activityLoaded
    const adminRole = isLoggedIn && lockCollection && lockCollection.admin
    const qaUserRole = isLoggedIn && user && (['qaUser', 'admin'].some(claim => userClaims.includes(claim)) || adminRole)

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
        return profileDB2State(value.data())
    }, [])

    const updateProfileField = useCallback(async (key, value) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', user.uid)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (!sfDoc.exists()) {
                transaction.set(ref, {[key]: value})
            } else {
                transaction.update(ref, {[key]: value})
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

    const addPickerActivity = useCallback(async (userId, act) => {
        const [collectName, rec] = activity2DBRec({...act, userId})
        const docRef = await addDoc(collection(db, collectName), rec)
        await invalidatePickerActivityCache(userId)
        await updateUserStatistics(userId)

        if (user.uid === userId) {
            setPickerActivity(a => a.concat(dbRec2Activity(collectName, docRef.id, rec)))
        }
    }, [user])

    const updatePickerActivity = useCallback(async (oldAct, newAct) => {
        const [collectName, rec] = activity2DBRec({...newAct, userId: oldAct.userId})
        await setDoc(doc(db, collectName, oldAct.id), rec)
        await invalidatePickerActivityCache(oldAct.userId)
        await updateUserStatistics(oldAct.userId)

        if (user.uid === oldAct.userId) {
            setPickerActivity(a => a.map(act => {
                if (act.id === oldAct.id) {
                    return dbRec2Activity(collectName, oldAct.id, rec)
                } else {
                    return act
                }
            }))
        }
    }, [user])

    const removePickerActivity = useCallback(async (acts) => {
        if (Array.isArray(acts)) {
            const batch = writeBatch(db)
            acts.forEach(a => batch.delete(doc(db, a.collectionDB, a.id)))
            await batch.commit()

            const userIds = acts.reduce((acc, a) => {
                return acc.includes(a.userId) ? acc : [...acc, a.userId]
            }, [])
            for (let idx = 0; idx < userIds.length; idx++) {
                await invalidatePickerActivityCache(userIds[idx])
                await updateUserStatistics(userIds[idx])
            }

            const currentIds = acts.filter(a => a.userId === user.uid).map(a => a.id)
            if (currentIds.length > 0) {
                setPickerActivity(a => a.filter(act => !currentIds.includes(act.id)))
            }
        } else {
            await deleteDoc(doc(db, acts.collectionDB, acts.id))
            await invalidatePickerActivityCache(acts.userId)
            await updateUserStatistics(acts.userId)
            if (user.uid === acts.userId) {
                setPickerActivity(a => a.filter(act => acts.id !== act.id))
            }
        }
    }, [user])

    const getPickerActivity = useCallback(async userId => {
        return await pickerActivityCache(userId, user?.uid === userId)
    }, [user])

    const refreshPickerActivity = useCallback(async userId => {
        await invalidatePickerActivityCache(userId)
        await updateUserStatistics(userId)
    }, [])

    const importUnclaimedEvidence = useCallback(async (userId, tabName) => {
        const bbRef = doc(db, 'unclaimed-blackbelts', tabName.trim())
        const bbDoc = await getDoc(bbRef)
        if (bbDoc.exists()) {
            let result = []
            const awardRef = doc(db, 'awards', btoa(userId + blackBeltAwardId))
            const awardDoc = await getDoc(awardRef)
            if (!awardDoc.exists()) {
                const newDoc = {
                    awardCreatedAt: Timestamp.fromDate(new Date(bbDoc.data().awardedAt)),
                    awardId: blackBeltAwardId,
                    awardUrl: 'admin',
                    userId: userId
                }
                result = result.concat([awardDB2Activity(awardRef.id, newDoc)])
                await setDoc(awardRef, newDoc)
            }
            await setDoc(doc(db, 'lockcollections', userId), {tabClaimed: tabName.trim()}, {merge: true})
            await updateDoc(bbRef, {claimed: true})

            const q = query(collection(db, 'unclaimed-evidence'), where('tabName', '==', tabName.trim()))
            const querySnapshot = await getDocs(q)
            const newEvidence = querySnapshot.docs.map(d => d.data())
            const newMatchIds = newEvidence.map(e => e.projectId)
            const toReplace = await pickerActivityCache(userId, false)
            const toReplaceIds = toReplace.filter(act => act.link === '' && newMatchIds.includes(act.matchId)).map(act => act.id)

            const batch = writeBatch(db)
            toReplaceIds.forEach(id => batch.delete(doc(db, 'evidence', id)))

            newEvidence.forEach(rec => {
                let {tabName, ...newDoc} = {...rec, userId}
                if (rec.evidenceCreatedAt) {
                    newDoc.evidenceCreatedAt = Timestamp.fromDate(new Date(rec.evidenceCreatedAt))
                }
                const docRef = doc(collection(db, 'evidence'))
                batch.set(docRef, newDoc)
                result = result.concat([evidenceDB2Activity(docRef.id, newDoc)])
            })

            await batch.commit()
            await invalidatePickerActivityCache(userId)
            await updateUserStatistics(userId)

            if (user.uid === userId) {
                setPickerActivity(a => a.filter(act => !toReplaceIds.includes(act.id)).concat(result))
            }
            return true
        }
        return false
    }, [user])

    const createEvidenceForEntries = useCallback(async (userId, ids) => {
        const batch = writeBatch(db)
        let result = []
        const newDocs = ids.map(matchId => ({
            userId,
            projectId: matchId,
            evidenceUrl: '',
            modifier: ''
        }))
        newDocs.forEach(nd => {
            const docRef = doc(collection(db, 'evidence'))
            batch.set(docRef, nd)
            result = result.concat([evidenceDB2Activity(docRef.id, nd)])
        })
        await batch.commit()
        await invalidatePickerActivityCache(userId)
        await updateUserStatistics(userId)

        if (user.uid === userId) {
            setPickerActivity(a => a.concat(result))
        }
    }, [user])

    const deleteAllUserData = useCallback(async (userId) => {
        await invalidatePickerActivityCache(userId)
        const acts = await pickerActivityCache(userId, false)
        await removePickerActivity(acts)

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
    }, [removePickerActivity])

    const oauthState = useCallback(async (userId, state) => {
        if (!userId) return false
        const ref = doc(db, 'lockcollections', userId)
        if (state) {
            const userDoc = await getDoc(ref)
            const profile = userDoc.data()
            return state === profile?.oauthState
        } else {
            const newState = (Math.random() + 1).toString(36).substring(2)
            await setDoc(ref, {oauthState: newState}, {merge: true})
            return newState
        }
    }, [])

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
        const newAwardsById = awards.map(aw => ({
            userId: user.uid,
            awardId: aw.matchId,
            awardUrl: aw.link,
            awardCreatedAt: Timestamp.fromDate(new Date(aw.awardedAt))
        })).reduce((acc, awd) => {
            if (!acc[awd.awardId] || awd.awardCreatedAt < acc[awd.awardId].awardCreatedAt) {
                acc[awd.awardId] = awd
            }
            return acc
        }, {})

        const lastAwardAt = Object.values(newAwardsById).reduce((acc, aw) => {
            return !acc || aw.awardCreatedAt > acc ? aw.awardCreatedAt : acc
        }, null)
        const existQ = query(collection(db, 'awards'), where('userId', '==', user.uid))
        const existSnapshot = await getDocs(existQ)
        const existAwards = existSnapshot.docs.map(awDoc => awDoc.data())

        const awardsToAdd = Object.values(newAwardsById).filter(awd => {
            const collision = existAwards.find(ea => ea.awardId === awd.awardId)
            return !collision || awd.awardCreatedAt < collision.awardCreatedAt || !isValidUrl(collision.awardUrl)
        })

        const batch = writeBatch(db)
        awardsToAdd.forEach(newDoc => {
            const ref = doc(db, 'awards', btoa(newDoc.userId + newDoc.awardId))
            batch.set(ref, newDoc)
        })
        await batch.commit()

        if (awardsToAdd.length > 0) {
            await invalidatePickerActivityCache(user.uid)
            const activity = await pickerActivityCache(user.uid, true)
            setPickerActivity(activity)
            await updateUserStatistics(user.uid)
        }
        if (username && bookmark) {
            let delta = {redditUsername: username, redditBookmark: bookmark}
            if (lastAwardAt) {
                delta.redditLastAwardAt = lastAwardAt
            }
            await setDoc(doc(db, 'lockcollections', user.uid), delta, {merge: true})
        }
    }, [user])

    const peekAtDiscordAwards = useCallback(async discordId => {
        const q = query(collection(db, 'awards-discord'), where('discordUserId', '==', discordId))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(awDoc => awDoc.data())
    }, [])

    const setDiscordUserInfo = useCallback(async (id, username) => {
        if (id && username) {
            const ref = doc(db, 'lockcollections', user.uid)
            await setDoc(ref, {discordId: id, discordUsername: username, discordBookmark: deleteField()}, {merge: true})

            await invalidatePickerActivityCache(user.uid)
            const activity = await pickerActivityCache(user.uid, true)
            setPickerActivity(activity)
        }
    }, [user])

    const removeServiceAuth = useCallback(async (service) => {
        const ref = doc(db, 'lockcollections', user.uid)
        if (service === 'Discord') {
            await setDoc(ref, {
                discordId: deleteField(),
                discordUsername: deleteField(),
                discordBookmark: deleteField()
            }, {merge: true})
        } else if (service === 'Reddit') {
            await setDoc(ref, {
                redditUsername: deleteField(),
                redditLastAwardAt: deleteField(),
                redditBookmark: deleteField()
            }, {merge: true})
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

    // Picker activity load
    useEffect(() => {
        async function loadActivity() {
            if (isLoggedIn) {
                const activity = await pickerActivityCache(user.uid, true)
                setPickerActivity(activity)
                setActivityLoaded(true)
            } else if (authLoaded) {
                setPickerActivity([])
                setActivityLoaded(true)
            }
        }

        loadActivity().then()
    }, [authLoaded, isLoggedIn, user])

    // System Messages Subscription
    useEffect(() => {
        const q = query(collection(db, 'system-messages'), where('status', '==', 'active'))
        return onSnapshot(q, querySnapshot => {
            const messages = querySnapshot.docs.map(doc => {
                return {...doc.data(), dbId: doc.id }
            })
            setSystemMessages(messages)
        }, error => {
            console.error('Error getting system messages from DB:', error)
        })
    }, [])

    const getAllSystemMessages = useCallback(async () => {
        const q = query(collection(db, 'system-messages'))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => {
            return {...doc.data(), dbId: doc.id }
        })
    }, [])

    const updateSystemMessage = useCallback(async (message) => {
        if (dbError) return false
        const id = message.dbId ? message.dbId : message.id
        const ref = doc(db, 'system-messages', id)
        await setDoc(ref, message)
    }, [dbError])

    const updateSystemMessageStatus = useCallback(async (messageId, status, timeStamp) => {
        if (dbError) return false
        const ref = doc(db, 'system-messages', messageId)
        await updateDoc(ref, {status: status, modified: timeStamp})
    }, [dbError])

    const removeDismissedMessages = useCallback(async (userId) => {
        if (dbError) return { success: false, message: 'Database error.' }
        const ref = doc(db, 'lockcollections', userId)
        try {
            await updateDoc(ref, {dismissedMessages: deleteField()})
            return { success: true, message: 'Dismissed messages removed from user:',  userId}
        } catch (error) {
            console.error('Error updating ranking request: ', error)
            if (error.code === 'permission-denied') {
                return { success: false, message: 'You do not have permission to preform this request.' }
            }
            return { success: false, message: `Error removing dismissed messages: ${error.message}` }
        }
    }, [dbError])


    const value = useMemo(() => ({
        dbLoaded,
        adminRole,
        lockCollection,
        addToLockCollection,
        removeFromLockCollection,
        getProfile,
        updateProfileField,
        updateProfileDisplayName,
        pickerActivity,
        addPickerActivity,
        updatePickerActivity,
        removePickerActivity,
        getPickerActivity,
        refreshPickerActivity,
        importUnclaimedEvidence,
        createEvidenceForEntries,
        deleteAllUserData,
        oauthState,
        getBookmarkForRedditUser,
        advanceBookmarkForRedditUser,
        setDiscordUserInfo,
        removeServiceAuth,
        peekAtDiscordAwards,
        systemMessages,
        getAllSystemMessages,
        updateSystemMessage,
        updateSystemMessageStatus,
        removeDismissedMessages,
        userLockNotes: lockCollection.userLockNotes || {},
        qaUserRole
    }), [dbLoaded,
        adminRole,
        lockCollection,
        addToLockCollection,
        removeFromLockCollection,
        getProfile,
        updateProfileField,
        updateProfileDisplayName,
        pickerActivity,
        addPickerActivity,
        updatePickerActivity,
        removePickerActivity,
        getPickerActivity,
        refreshPickerActivity,
        importUnclaimedEvidence,
        createEvidenceForEntries,
        deleteAllUserData,
        oauthState,
        getBookmarkForRedditUser,
        advanceBookmarkForRedditUser,
        setDiscordUserInfo,
        removeServiceAuth,
        peekAtDiscordAwards,
        systemMessages,
        getAllSystemMessages,
        updateSystemMessage,
        updateSystemMessageStatus,
        removeDismissedMessages,
        qaUserRole
    ])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}


function evidenceDB2Activity(id, dbRec) {
    return {
        id: id,
        userId: dbRec.userId,
        matchId: dbRec.projectId,
        link: dbRec.evidenceUrl,
        date: dbRec.evidenceCreatedAt && dbRec.evidenceCreatedAt.toDate().toJSON(),
        collectionDB: 'evidence',
        evidenceModifier: dbRec.modifier
    }
}

function awardDB2Activity(id, dbRec) {
    return {
        id: id,
        userId: dbRec.userId,
        matchId: dbRec.awardId,
        link: dbRec.awardUrl,
        date: dbRec.awardCreatedAt && dbRec.awardCreatedAt.toDate().toJSON(),
        collectionDB: 'awards'
    }
}

function dbRec2Activity(collectName, id, dbRec) {
    if (collectName === 'awards') {
        return awardDB2Activity(id, dbRec)
    } else {
        return evidenceDB2Activity(id, dbRec)
    }
}

function activity2DBRec(act) {
    if (isAward(act.matchId)) {
        const rec = {
            userId: act.userId,
            awardId: act.matchId,
            awardUrl: act.link,
            awardCreatedAt: Timestamp.fromDate(new Date(act.date))
        }
        return ['awards', rec]
    } else {
        let rec = {
            userId: act.userId,
            evidenceUrl: act.link,
            modifier: act.evidenceModifier
        }
        if (act.matchId) {
            rec.projectId = act.matchId
        }
        if (act.date) {
            rec.evidenceCreatedAt = Timestamp.fromDate(new Date(act.date))
        }
        return ['evidence', rec]
    }
}

function profileDB2State(dbRec) {
    if (dbRec) {
        const additionalFields = Object.keys(collectionOptions).reduce((acc, type) => {
            const anyKey = collectionOptions[type].map.find(c => c.entry === 'system:any')?.key
            const valKeys = collectionOptions[type].map.filter(c => c.entry !== 'system:any')?.map(c => c.key)
            if (anyKey) acc[anyKey] = [...new Set(valKeys.map(k => dbRec[k]).filter(k => k).flat())]
            return acc
        }, {})

        return {...dbRec, ...additionalFields}
    } else {
        return dbRec
    }
}

async function matchNewDiscordAwards(userId, existingAwardDocs) {
    const userRef = doc(db, 'lockcollections', userId)
    const userDoc = await getDoc(userRef)
    const prof = userDoc.data()
    if (!prof || !prof.discordId) return []
    let retval = []

    const q = prof.discordBookmark ?
        query(collection(db, 'awards-discord'), where('discordUserId', '==', prof.discordId), where('awardCreatedAt', '>', prof.discordBookmark)) :
        query(collection(db, 'awards-discord'), where('discordUserId', '==', prof.discordId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.docs.length > 0) {
        let bookmark = null
        const newAwardsById = querySnapshot.docs.map(awDoc => {
            const aw = awDoc.data()
            const award = lookupAwardByBelt(aw.discordAwardName.match(/^(\w+) Belt/)?.[1], aw.discordAwardName.match(/^(\d+)/)?.[1], aw.discordAwardName)
            const newDoc = {
                userId: userId,
                awardId: award.id,
                awardCreatedAt: aw.awardCreatedAt,
                awardUrl: aw.awardUrl
            }
            bookmark = !bookmark || newDoc.awardCreatedAt > bookmark ? newDoc.awardCreatedAt : bookmark
            return newDoc
        }).reduce((acc, awd) => {
            if (!acc[awd.awardId] || awd.awardCreatedAt < acc[awd.awardId].awardCreatedAt) {
                acc[awd.awardId] = awd
            }
            return acc
        }, {})
        const awardsToAdd = Object.values(newAwardsById).filter(awd => {
            const collision = existingAwardDocs.find(ea => ea.awardId === awd.awardId)
            return !collision || awd.awardCreatedAt < collision.awardCreatedAt || !isValidUrl(collision.awardUrl)
        })

        const batch = writeBatch(db)
        awardsToAdd.forEach(newDoc => {
            const destRef = doc(db, 'awards', btoa(newDoc.userId + newDoc.awardId))
            batch.set(destRef, newDoc)
            retval.push(awardDB2Activity(destRef.id, newDoc))
        })
        await batch.commit()
        if (bookmark) {
            await setDoc(userRef, {discordBookmark: bookmark}, {merge: true})
        }
    }
    return retval
}

async function pickerActivityCache(userId, update) {
    const queryStr = `activity: userId == ${userId}`
    const docRef = doc(db, 'query-cache', queryStr)
    const cached = await getDoc(docRef)

    if (cached.exists()) {
        return JSON.parse(cached.data().payload)
    } else {
        const evidQ = query(collection(db, 'evidence'), where('userId', '==', userId))
        const evidSnapshot = await getDocs(evidQ)
        const evidence = evidSnapshot.docs.map(rec => evidenceDB2Activity(rec.id, rec.data()))

        const awardQ = query(collection(db, 'awards'), where('userId', '==', userId))
        const awardSnapshot = await getDocs(awardQ)
        const existingAwardDocs = awardSnapshot.docs.map(rec => rec.data())
        const existingAwards = awardSnapshot.docs.map(rec => awardDB2Activity(rec.id, rec.data()))
        const newAwards = update ? await matchNewDiscordAwards(userId, existingAwardDocs) : []
        const newAwardIds = newAwards.map(aw => aw.matchId)
        const preserveAwards = existingAwards.filter(aw => !newAwardIds.includes(aw.matchId))

        const result = [...evidence, ...preserveAwards, ...newAwards]
        if (update) {
            await setDoc(docRef, {payload: JSON.stringify(result)})
            await updateUserStatistics(userId)
        }
        return result
    }
}

async function invalidatePickerActivityCache(userId) {
    const queryStr = `activity: userId == ${userId}`
    await deleteDoc(doc(db, 'query-cache', queryStr))
}

async function updateUserStatistics(userId) {
    const activity = await pickerActivityCache(userId, false)
    const scored = calculateScoreForUser(activity)
    const recordedLocks = scored.scoredActivity.filter(a => isLock(a.matchId)).map(a => a.matchId)
    const projects = scored.scoredActivity.filter(a => isProject(a.matchId)).map(a => a.matchId)
    const awards = scored.scoredActivity.filter(a => isAward(a.matchId)).map(a => a.matchId)
    const awardedDan = awards.reduce((acc, awardId) => {
        const award = getAwardEntryFromId(awardId)
        return award?.awardType === 'dan'
            ? Math.max(acc, award.rank)
            : acc
    }, 0)
    let newDoc = {
        danPoints: scored.danPoints,
        blackBeltCount: scored.bbCount,
        danLevel: scored.eligibleDan,
        awardedDan: awardedDan,
        recordedLocks: recordedLocks,
        projects: projects,
        awards: awards
    }
    const blackBelt = activity.find(a => a.matchId === blackBeltAwardId)
    if (blackBelt) {
        newDoc.blackBeltAwardedAt = Timestamp.fromDate(new Date(blackBelt.date))
    }
    await setDoc(doc(db, 'lockcollections', userId), newDoc, {merge: true})
}

export default DBContext
