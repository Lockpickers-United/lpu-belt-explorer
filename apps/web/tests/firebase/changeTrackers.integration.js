import assert from 'node:assert/strict'
import {deleteApp, initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

const expectedProjectId = 'demo-lpubelts'
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST
const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT

assert.match(
    emulatorHost || '',
    /^(127\.0\.0\.1|localhost):\d+$/,
    'The integration test requires a loopback Firestore emulator'
)
assert.equal(
    projectId,
    expectedProjectId,
    `The integration test must run against ${expectedProjectId}`
)

const mappings = [
    {
        sourceCollection: 'lockcollections',
        changeIndexCollection: 'lockcollectionsChangeIndex'
    },
    {
        sourceCollection: 'awards',
        changeIndexCollection: 'awardsChangeIndex'
    },
    {
        sourceCollection: 'evidence',
        changeIndexCollection: 'evidenceChangeIndex'
    }
]

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

async function waitForIndex(indexRef, predicate, description) {
    const timeoutAt = Date.now() + 20_000
    let lastData = null

    while (Date.now() < timeoutAt) {
        const snapshot = await indexRef.get()
        lastData = snapshot.exists ? snapshot.data() : null

        if (lastData && predicate(lastData)) return lastData
        await delay(200)
    }

    throw new Error(`${description}. Last index data: ${JSON.stringify(lastData)}`)
}

function assertIndexData(data, {docId, deleted, sourceCollection}) {
    assert.equal(data.docId, docId)
    assert.equal(data.deleted, deleted)
    assert.equal(data.sourceCollection, sourceCollection)
    assert.equal(typeof data.changedAt?.toMillis, 'function')
}

async function testChangeTracker(db, mapping) {
    const {sourceCollection, changeIndexCollection} = mapping
    const docId = `integration-${sourceCollection}-${Date.now()}`
    const sourceRef = db.collection(sourceCollection).doc(docId)
    const indexRef = db.collection(changeIndexCollection).doc(docId)

    await sourceRef.set({integrationTest: true, revision: 1})
    const created = await waitForIndex(
        indexRef,
        data => data.deleted === false,
        `${sourceCollection} create was not indexed`
    )
    assertIndexData(created, {docId, deleted: false, sourceCollection})

    await delay(100)
    await sourceRef.update({revision: 2})
    const updated = await waitForIndex(
        indexRef,
        data => data.deleted === false &&
            data.changedAt?.toMillis() > created.changedAt.toMillis(),
        `${sourceCollection} update was not indexed`
    )
    assertIndexData(updated, {docId, deleted: false, sourceCollection})

    await delay(100)
    await sourceRef.delete()
    const deleted = await waitForIndex(
        indexRef,
        data => data.deleted === true &&
            data.changedAt?.toMillis() > updated.changedAt.toMillis(),
        `${sourceCollection} deletion was not indexed`
    )
    assertIndexData(deleted, {docId, deleted: true, sourceCollection})

    console.log(`Passed create/update/delete: ${sourceCollection}`)
}

const app = initializeApp({projectId})
const db = getFirestore(app)

try {
    for (const mapping of mappings) {
        await testChangeTracker(db, mapping)
    }

    console.log('All Firestore change-tracker integration tests passed')
} finally {
    await deleteApp(app)
}
