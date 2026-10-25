import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {deleteApp, initializeApp} from 'firebase/app'
import {
    connectAuthEmulator,
    getAuth,
    signInAnonymously,
    signOut
} from 'firebase/auth'
import {
    connectFirestoreEmulator,
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    runTransaction,
    setDoc,
    updateDoc
} from 'firebase/firestore'

const projectId = process.env.GCLOUD_PROJECT
const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST
const firestoreEmulatorHost = process.env.FIRESTORE_EMULATOR_HOST
const loopbackHost = /^(127\.0\.0\.1|localhost|\[::1\]):\d+$/

assert.equal(projectId, 'demo-lpubelts', 'The web SDK integration test requires its demo project.')
assert.match(authEmulatorHost || '', loopbackHost, 'The Auth emulator must use a loopback host.')
assert.match(firestoreEmulatorHost || '', loopbackHost, 'The Firestore emulator must use a loopback host.')

const [firestoreHost, firestorePort] = firestoreEmulatorHost.split(':')
const app = initializeApp({
    apiKey: 'test-only-api-key',
    authDomain: `${projectId}.firebaseapp.com`,
    projectId
}, `firebase-web-sdk-${randomUUID()}`)
const auth = getAuth(app)
const db = getFirestore(app)

connectAuthEmulator(auth, `http://${authEmulatorHost}`, {disableWarnings: true})
connectFirestoreEmulator(db, firestoreHost, Number(firestorePort))

const documentReference = doc(db, 'firebase-web-sdk', randomUUID())
let unsubscribe

try {
    const credential = await signInAnonymously(auth)
    assert.ok(credential.user.uid, 'Anonymous emulator sign-in should return a user ID.')

    const observedCreate = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timed out waiting for Firestore subscription.')), 5000)

        unsubscribe = onSnapshot(documentReference, snapshot => {
            if (snapshot.data()?.state === 'created') {
                clearTimeout(timeout)
                resolve(snapshot.data())
            }
        }, error => {
            clearTimeout(timeout)
            reject(error)
        })
    })

    await setDoc(documentReference, {state: 'created', count: 1})
    assert.deepEqual(await observedCreate, {state: 'created', count: 1})

    await runTransaction(db, async transaction => {
        const snapshot = await transaction.get(documentReference)
        transaction.update(documentReference, {count: snapshot.data().count + 1})
    })
    await updateDoc(documentReference, {state: 'updated'})

    const updatedSnapshot = await getDoc(documentReference)
    assert.deepEqual(updatedSnapshot.data(), {state: 'updated', count: 2})

    await deleteDoc(documentReference)
    assert.equal((await getDoc(documentReference)).exists(), false)

    await assert.rejects(
        getDoc(doc(db, 'firebase-web-sdk-denied', randomUUID())),
        error => error.code === 'permission-denied'
    )

    console.log('Firebase web SDK emulator integration passed.')
} finally {
    unsubscribe?.()
    await signOut(auth).catch(() => {})
    await deleteApp(app)
}
