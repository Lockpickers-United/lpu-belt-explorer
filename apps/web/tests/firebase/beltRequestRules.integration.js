import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {deleteApp as deleteAdminApp, initializeApp as initializeAdminApp} from 'firebase-admin/app'
import {getAuth as getAdminAuth} from 'firebase-admin/auth'
import {deleteApp, initializeApp} from 'firebase/app'
import {connectAuthEmulator, getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {connectFirestoreEmulator, collection, deleteDoc, doc, getDoc, getDocs,
    getFirestore, query, runTransaction, setDoc, updateDoc, where} from 'firebase/firestore'

const projectId = process.env.GCLOUD_PROJECT
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST
const loopback = /^(127\.0\.0\.1|localhost|\[::1\]):\d+$/
assert.equal(projectId, 'demo-lpubelts')
assert.match(authHost || '', loopback)
assert.match(firestoreHost || '', loopback)

const adminApp = initializeAdminApp({projectId}, `belt-requests-admin-${randomUUID()}`)
const adminAuth = getAdminAuth(adminApp)
const apps = []
const suffix = randomUUID()
const password = 'emulator-only-password'

async function client(role, claims) {
    const email = `${role}-${suffix}@example.test`
    const user = await adminAuth.createUser({email, password})
    await adminAuth.setCustomUserClaims(user.uid, claims)
    const app = initializeApp({apiKey: 'test-only-api-key', projectId,
        authDomain: `${projectId}.firebaseapp.com`}, `belt-requests-${role}-${suffix}`)
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
    const ordinary = await client('ordinary', {})
    const admin = await client('admin', {admin: true})
    const team = await client('team', {beltRequestTeam: true})
    const mod = await client('mod', {lpuMod: true})
    const guestApp = initializeApp({apiKey: 'test-only-api-key', projectId}, `guest-${suffix}`)
    apps.push(guestApp)
    const guestDb = getFirestore(guestApp)
    const [host, port] = firestoreHost.split(':')
    connectFirestoreEmulator(guestDb, host, Number(port))
    const requestId = `request-${suffix}`
    const ref = doc(ordinary.db, 'belt-requests', requestId)
    // Exercise the same read-then-create transaction used by the form provider.
    await runTransaction(ordinary.db, async transaction => {
        assert.equal((await transaction.get(ref)).exists(), false)
        transaction.set(ref, {status: 'incoming', platform: 'Discord'})
    })
    assert.equal((await getDoc(ref)).data().status, 'incoming')
    assert.equal((await getDocs(query(collection(ordinary.db, 'belt-requests'),
        where('status', '==', 'incoming')))).size, 1)
    await assert.rejects(getDocs(collection(guestDb, 'belt-requests')), denied)
    await assert.rejects(setDoc(doc(guestDb, 'belt-requests', `guest-${suffix}`),
        {status: 'incoming'}), denied)
    for (const [role, db] of [['ordinary', ordinary.db], ['admin', admin.db],
        ['team', team.db], ['mod', mod.db]]) {
        await setDoc(doc(db, 'belt-requests', `${role}-incoming-${suffix}`),
            {status: 'incoming', platform: 'Reddit'})
        for (const status of ['open', 'checked-out', 'approved', 'processing-approve',
            'processing-deny', 'deleted', '', null, 1, true]) {
            await assert.rejects(setDoc(doc(db, 'belt-requests', `${role}-invalid-${suffix}`),
                {status}), denied)
        }
        await assert.rejects(setDoc(doc(db, 'belt-requests', `${role}-missing-${suffix}`),
            {platform: 'Discord'}), denied)
    }
    await assert.rejects(updateDoc(ref, {status: 'open'}), denied)
    await assert.rejects(updateDoc(ref, {status: 'incoming', extra: 'changed'}), denied)
    await assert.rejects(deleteDoc(ref), denied)
    for (const reviewer of [admin, team, mod]) {
        await updateDoc(doc(reviewer.db, 'belt-requests', requestId), {status: 'open'})
    }
    await assert.rejects(deleteDoc(doc(team.db, 'belt-requests', requestId)), denied)
    await assert.rejects(deleteDoc(doc(mod.db, 'belt-requests', requestId)), denied)
    await deleteDoc(doc(admin.db, 'belt-requests', requestId))
    // Intentional prototype flexibility: identity/schema fields are not verified.
    await setDoc(doc(ordinary.db, 'belt-requests', `flexible-${suffix}`),
        {status: 'incoming', userId: 'unverified-platform-id', arbitraryField: true})
    console.log('Belt request rules: member transaction, create status restrictions for all roles, guest denial, reviewer updates, admin deletes, and flexible payload checks passed.')
} finally {
    await Promise.all(apps.map(app => deleteApp(app)))
    await deleteAdminApp(adminApp)
}
