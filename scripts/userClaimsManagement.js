import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {getAuth} from 'firebase-admin/auth'
import {setDeepAdd} from '../src/util/setDeep.js'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json').toString())
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')

const db = getFirestore(app)

// TODO: always write to both databases

const WRITE_TO_DB = false

const AUDIT = true
const UPDATE = true

// Custom claims to set
const _allClaims = {
    admin: true,
    raflAdmin: true,
    qaUser: true,
    lpuMod: true,
    dataAdmin: true,    // can write to firebase: data-cache
    classificationAdmin: true,
    classificationTeam: true,
    blackBelt: true
}
//const newClaims = {raflAdmin:true, dataAdmin:true, admin: true}
const newClaims = {blackBelt: true}
const removeClaims = []

const users = [
    {uid: 'stQnC996GjdWVNnHjLMVZjWuQF23', name: 'mgsecure'}
]

const _Allusers = [
    {uid: 'GGplAdctTfVDLVvYsfIADJmfp8f2', name: 'mgsecure'},
    {uid: '4qqxB0nW8dczUws5XuAyhEkgZEj2', name: 'mgtest'},
    {uid: 'DQlzrseJbXR5Sw9eBKpmePfSCpk2', name: 'LpuBelts'},
    {uid: 'rbeLhuQ49TT4ICbKVHjVTVz1O0q2', name: 'Jaye'},
    {uid: 'WMSvvuutyShfvBBYB3PmDe4fmeS2', name: 'NiXXeD'},
    {uid: 'Mwbvdkq1QtWu2zLwEaj3imULSry1', name: 'decoder'},
    {uid: 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3', name: 'tonysansan'},
    {uid: 'mZyfQIARjCP1uJJJc7ioMAALV9v2', name: 'peace'},
    {uid: 'XoUDXU5McjTuVnPA1xfmzytcKuy2', name: 'Red Wanderer'},
    {uid: '84dULJFIN4bHIC1LxCiuvBCSqT43', name: 'todd'},
    {uid: 'Hqww5ljRCfQjMppspbvFZsZ5xQI2', name: 'CorrectJeans'},
    {uid: 's5iyDrszY4Nc3zR7rILCQLO7I8v2', name: 'Norlin'},
    {uid: 'vOi8rfTRluYlcVizuVvX9PWFJdn2', name: 'Dynamic'},
    {uid: 'XKPQaAR525XV2JsqGn12eEKwxD62', name: 'dnd'},
    {uid: 'f2yySWbxUBXF8k3HgorYhrm76gx2', name: 'Rein'},
    {uid: '8PKfUHTiafgObsQQr162dQRlBCo1', name: 'GravityKarma'},
    {uid: 'pzSak8xusHdeNlD0JmTru5kMrww2', name: 'Sidepicks'},
    {uid: 'A7MNzg6jrNUIgfEkk8U0JzZndcx2', name: 'amvgaert'}

]

async function updateCustomClaimsForUsers() {
    for (const user of users) {
        const {uid, name} = user
        try {
            const userRecord = await getAuth().getUser(uid)
            const currentClaims = userRecord.customClaims || {}
            for (const claim of removeClaims) {
                delete currentClaims[claim]
            }
            const updatedClaims = {...currentClaims, ...newClaims}
            if (WRITE_TO_DB) await getAuth().setCustomUserClaims(uid, updatedClaims)

            const ref = db.doc(`/user-claims-info/${uid}`)
            if (WRITE_TO_DB) await ref.set({...updatedClaims, name})

            console.log(`${WRITE_TO_DB ? 'Updated' : 'WRITE_TO_DB is off, not saving'} custom claims for user ${uid} (${userRecord.displayName})`, updatedClaims)
        } catch (error) {
            console.error(`Error updating custom claims for user ${uid}:`, error)
        }
    }
    console.log('Finished updating custom claims for all users.')
    process.exit(0)
}

async function _getCustomClaimsForUser(uid) {
    await getAuth().getUser(uid)
        .then(userRecord => {
            console.log('Custom claims for user', uid, `(${name})`, userRecord.customClaims)
            return userRecord.customClaims
        })
        .catch(error => {
            console.error('Error fetching user data:', error)
        })

}

async function getCustomClaimsForUsers(userList) {
    for (const user of userList) {
        const {uid, name} = user
        await getAuth().getUser(uid)
            .then(userRecord => {
                console.log('Custom claims for user', uid, `(${name})`, userRecord.customClaims)
            })
            .catch(error => {
                console.error('Error fetching user data:', error)
            })
    }
    console.log('Finished logging custom claims for all users.')
    process.exit(0)
}

async function getAllUsersWithClaims() {
    const usersWithClaims = []
    let nextPageToken

    try {
        do {
            const listUsersResult = await getAuth().listUsers(1000, nextPageToken)

            for (const userRecord of listUsersResult.users) {

                const claims = userRecord.customClaims
                const ref = db.doc(`/user-claims-info/${userRecord.uid}`)
                const cacheClaims = claims ? await ref.get() : null

                let issues = []
                claims && Object.entries(claims).forEach(([key, value]) => {
                    if (cacheClaims && cacheClaims.data()?.[key] !== value) {
                        issues.push({ key, claim: value, cache: cacheClaims.data()?.[key] ?? 'no value' })
                    }
                })

                const issuesList = issues.length ? {issues} : {}

                claims && usersWithClaims.push({
                    uid: userRecord.uid,
                    email: userRecord.email,
                    displayName: userRecord.displayName,
                    claims,
                    cacheClaims: cacheClaims ? cacheClaims.data() : null,
                    ...issuesList
                })
            }

            nextPageToken = listUsersResult.pageToken
        } while (nextPageToken)

        return usersWithClaims
    } catch (error) {
        console.error('Error listing users:', error)
        throw error
    }
}

if (AUDIT) {

    const claimsAudit = await getAllUsersWithClaims()
    const issues = claimsAudit.filter(user => user.issues && user.issues.length > 0)
    console.log('issues:', issues)

    const claimCounts = claimsAudit.reduce((acc, user) => {
        Object.keys(user.claims).forEach(claim => {
            setDeepAdd(acc, [claim], 1)
        })
        return acc
    }, {})

    fs.writeFile('./claimsAudit.json', JSON.stringify({issues, claimCounts, claimsAudit}, null, 2), function (err) {
        if (err) {
            console.error('save claimsAudit.json error:', err)
            return (`save claimsAudit.json error: ${err}`)
        } else {
            console.log('claimsAudit.json saved')
            return ('claimsAudit.json saved')
        }
    })

    if (issues.length > 0 && UPDATE) {

        for (const userRecord of issues) {

            const cache = db.doc(`/user-claims-info/${userRecord.uid}`)
            const cacheClaims = await cache.get()

            let name
            if (cacheClaims.exists) {
                name = cacheClaims.data().name
            } else {
                const profileDoc = db.doc(`/lockcollections/${userRecord.uid}`)
                const profile = await profileDoc.get()
                name = profile.data().displayName || `${cacheClaims.data().displayName} (real name)`
            }
            const updatedClaims = {name, ...userRecord.claims}
            if (WRITE_TO_DB) {
                await cache.set({...updatedClaims, name})
            }
            console.log(`write to db is ${WRITE_TO_DB ? 'ON: updated' : 'OFF: did not update'} cache for user:`, userRecord.uid)
        }
    }

} else {

    await updateCustomClaimsForUsers(users).then(() => {
        getCustomClaimsForUsers(users).then()
    })

}


