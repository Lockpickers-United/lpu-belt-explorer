import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {getAuth} from 'firebase-admin/auth'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json').toString())
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')

const db = getFirestore(app)
const blackBeltAwardId = 'da7759a9'

const WRITE_TO_DB = false
const TEST_IDS = [] //['T8ZIBbRo2pXkxzybohOPf7McW532']

const DEBUG = true
const CHECK_PROFILES = false

////////////////////////////////////////////////

async function getBlackBeltAwardIds() {
    let blackBeltUserIds = []
    const blackBeltDocs = await db.collection('awards').where('awardId', '==', blackBeltAwardId).get()
    blackBeltDocs.forEach(rec => {
        if (!blackBeltUserIds.includes(rec.data().userId)) blackBeltUserIds.push(rec.data().userId)
        DEBUG && console.log(`user ${rec.data().userId} blackBeltAwardedAt: ${rec.data().awardCreatedAt.toDate().toJSON()}`)
    })
    return blackBeltUserIds
}

async function getProfiles(userIds) {
    const profiles = {}
    for (const uid of userIds) {
        const profileDoc = await db.collection('lockcollections').doc(uid).get()
        const claimsDoc = await db.collection('user-claims-info').doc(uid).get()
        profiles[uid] = {uid, profile: profileDoc.data(), claimsCache: claimsDoc.data()}
    }
    return profiles
}

async function _getBlackBeltClaimUsers() {
    // not supported
}


async function updateBlackBeltClaims(users) {

    const claimsData = []

    for (const user of users) {
        const {uid, name} = user
        const userRecord = await getAuth().getUser(uid)
        const currentClaims = userRecord.customClaims || {}

        const ref = db.doc(`/user-claims-info/${uid}`)
        const currentClaimsCache = await ref.get().then(doc => doc.data()) || {}

        const existingClaims = Array.from(new Set([...Object.keys(currentClaims || {}), ...Object.keys(currentClaimsCache || {})]))
        const cacheIssues = existingClaims.reduce((acc, claim) => {
            if (claim !== 'name' && currentClaims?.[claim] !== currentClaimsCache?.[claim]) {
                console.error(`User ${uid}, claim ${claim} does not match between current claims and cache`)
                acc.push({
                    claim,
                    user: currentClaims[claim],
                    cache: currentClaimsCache[claim],
                })
            }
            return acc
        }, [])

        const change = currentClaims.blackBelt !== true && currentClaims.blackBelt !== false
        const updatedClaims = change
            ? {...currentClaims, blackBelt: true}
            : currentClaims
        if (WRITE_TO_DB && change) {
            await getAuth().setCustomUserClaims(uid, {...updatedClaims})
            await ref.set({...updatedClaims, name})
        }
        const allClaims = Array.from(new Set([...Object.keys(currentClaims || {}), ...Object.keys(updatedClaims || {})]))
        const result = allClaims.reduce((acc, claim) => {
            const changed = currentClaims[claim] !== updatedClaims[claim] ? {changed: true} : {}
            return {
                ...acc,
                [claim]: {
                    old: currentClaims[claim],
                    new: updatedClaims[claim],
                    ...changed
                }
            }
        }, {})
        claimsData.push({uid, name, ...result, cacheIssues})
    }
    return claimsData
}

async function checkBlackBeltProfiles(userIds) {
    let blackBeltProfiles = []
    const blackBeltProfileDocs = await db.collection('lockcollections').where('blackBeltAwardedAt', '!=', 0).get()
    blackBeltProfileDocs.forEach(doc => {
        blackBeltProfiles.push({...doc.data(), id: doc.id})
    })
    console.log(`blackBelt user count: ${userIds.length}`)
    console.log(`blackBelt profile count: ${blackBeltProfiles.length}`)

    const noMatches = []
    for (const id of userIds) {
        const profileDoc = await db.collection('lockcollections').doc(id).get()
        if (!profileDoc.data().blackBeltAwardedAt)
            noMatches.push(`user ${id} | ${profileDoc.data().displayName} | profile: no black belt award found`)
    }
    for (const profile of blackBeltProfiles) {
        if (!blackBeltUserIds.includes(profile.id))
            noMatches.push(`user ${profile.userId} | ${profile.displayName} | award not found`)
    }
    return noMatches.length ? noMatches : 'no mismatches found'
}

const blackBeltUserIds = TEST_IDS.length ? TEST_IDS : await getBlackBeltAwardIds()

DEBUG && console.log('blackBeltUserIds', blackBeltUserIds)

CHECK_PROFILES && await checkBlackBeltProfiles(blackBeltUserIds).then(console.log)

const blackBeltProfiles = await getProfiles(blackBeltUserIds)
const blackBeltUsers = blackBeltUserIds.map(uid => {
    return {uid, name: blackBeltProfiles[uid]?.profile?.displayName ?? 'no display name'}
})

await updateBlackBeltClaims(blackBeltUsers).then(res => {
    console.log('results', JSON.stringify(res, null, 2), res[0]?.cacheIssues)
    !WRITE_TO_DB && console.log('WRITE_TO_DB is false, no changes written')
})