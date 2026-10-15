import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {deleteApp as deleteAdminApp, initializeApp as initializeAdminApp} from 'firebase-admin/app'
import {getAuth as getAdminAuth} from 'firebase-admin/auth'
import {getFirestore as getAdminFirestore} from 'firebase-admin/firestore'
import {deleteApp, initializeApp} from 'firebase/app'
import {connectAuthEmulator, getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {connectFirestoreEmulator, collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
    query, setDoc, updateDoc, where} from 'firebase/firestore'

const projectId = process.env.GCLOUD_PROJECT
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST
const loopback = /^(127\.0\.0\.1|localhost|\[::1\]):\d+$/
assert.equal(projectId, 'demo-lpubelts')
assert.match(authHost || '', loopback)
assert.match(firestoreHost || '', loopback)

const adminApp = initializeAdminApp({projectId}, `classification-admin-${randomUUID()}`)
const adminAuth = getAdminAuth(adminApp)
const adminDb = getAdminFirestore(adminApp)
const apps = []
const suffix = randomUUID()
const password = 'emulator-only-password'

async function client(role, claims) {
    const email = `${role}-${suffix}@example.test`
    const user = await adminAuth.createUser({email, password})
    await adminAuth.setCustomUserClaims(user.uid, claims)
    const app = initializeApp({apiKey: 'test-only-api-key', projectId,
        authDomain: `${projectId}.firebaseapp.com`}, `classification-${role}-${suffix}`)
    apps.push(app)
    const auth = getAuth(app)
    connectAuthEmulator(auth, `http://${authHost}`, {disableWarnings: true})
    const [host, port] = firestoreHost.split(':')
    const db = getFirestore(app)
    connectFirestoreEmulator(db, host, Number(port))
    await signInWithEmailAndPassword(auth, email, password)
    return {db, uid: user.uid}
}

const denied = error => error?.code === 'permission-denied'

try {
    const owner = await client('owner', {classificationTeam: true})
    const other = await client('other', {blackBelt: true})
    const ordinary = await client('ordinary', {})
    const guestApp = initializeApp({apiKey: 'test-only-api-key', projectId,
        authDomain: `${projectId}.firebaseapp.com`}, `classification-guest-${suffix}`)
    apps.push(guestApp)
    const guestDb = getFirestore(guestApp)
    const [guestHost, guestPort] = firestoreHost.split(':')
    connectFirestoreEmulator(guestDb, guestHost, Number(guestPort))
    const voteId = `vote-${suffix}`
    const entryId = `entry-${suffix}`
    const otherEntryId = `other-${suffix}`
    await adminDb.collection('classificationVotes').doc(voteId).set({
        entryId, userId: owner.uid, votedBelt: 'Blue', comment: 'private vote'
    })
    await adminDb.collection('classificationEntries').doc(entryId).set({
        entryId, currentVoteChips: [{userId: owner.uid, votedBelt: 'Blue'}]
    })
    await adminDb.collection('classificationEntryStates').doc(entryId).set({
        entryId, voterIds: [owner.uid]
    })
    await adminDb.collection('classificationEntryStates').doc(otherEntryId).set({
        entryId: otherEntryId, voterIds: [other.uid]
    })
    await adminDb.collection('classificationFeatureEntries').doc(entryId).set({
        entryId, hasModernVotes: true
    })

    assert.equal((await getDocs(collection(ordinary.db, 'classificationFeatureEntries'))).size, 1)
    await assert.rejects(getDocs(collection(guestDb, 'classificationFeatureEntries')), denied)
    await assert.rejects(getDoc(doc(guestDb, 'classificationFeatureEntries', entryId)), denied)
    await assert.rejects(setDoc(doc(ordinary.db, 'classificationFeatureEntries', otherEntryId), {
        entryId: otherEntryId, hasModernVotes: false
    }), denied)
    await assert.rejects(updateDoc(doc(ordinary.db, 'classificationFeatureEntries', entryId), {
        hasModernVotes: false
    }), denied)
    await assert.rejects(deleteDoc(doc(ordinary.db, 'classificationFeatureEntries', entryId)), denied)

    await assert.rejects(getDoc(doc(ordinary.db, 'classificationEntries', entryId)), denied)
    await assert.rejects(getDoc(doc(ordinary.db, 'classificationVotes', voteId)), denied)
    assert.equal((await getDoc(doc(owner.db, 'classificationEntries', entryId))).exists(), true)
    assert.equal((await getDoc(doc(other.db, 'classificationEntries', entryId))).exists(), true)
    assert.equal((await getDoc(doc(owner.db, 'classificationVotes', voteId))).exists(), true)
    await assert.rejects(getDoc(doc(other.db, 'classificationVotes', voteId)), denied)
    assert.equal((await getDoc(doc(owner.db, 'classificationEntryStates', entryId))).exists(), true)
    await assert.rejects(getDoc(doc(other.db, 'classificationEntryStates', entryId)), denied)

    const ownerVotes = await getDocs(query(collection(owner.db, 'classificationVotes'),
        where('userId', '==', owner.uid)))
    assert.equal(ownerVotes.size, 1)
    await assert.rejects(getDocs(collection(owner.db, 'classificationVotes')), denied)
    const ownerStates = await getDocs(query(collection(owner.db, 'classificationEntryStates'),
        where('voterIds', 'array-contains', owner.uid)))
    assert.equal(ownerStates.size, 1)
    await assert.rejects(getDocs(collection(owner.db, 'classificationEntryStates')), denied)
    await assert.rejects(setDoc(doc(owner.db, 'classificationVotes', `unauthorized-${suffix}`), {
        entryId, userId: owner.uid, votedBelt: 'Blue'
    }), denied)
    await assert.rejects(setDoc(doc(other.db, 'classificationEntries', entryId), {entryId}), denied)
    await assert.rejects(getDoc(doc(owner.db, 'classificationActions', `action-${suffix}`)), denied)
    console.log('Classification rules emulator checks passed.')
} finally {
    await Promise.all(apps.map(app => deleteApp(app)))
    await deleteAdminApp(adminApp)
}
