import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {deleteApp, initializeApp} from 'firebase-admin/app'
import {getFirestore, Timestamp} from 'firebase-admin/firestore'

const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST
assert.equal(projectId, 'demo-lpubelts')
assert.match(emulatorHost || '', /^(127\.0\.0\.1|localhost):\d+$/)

const app = initializeApp({projectId}, `activity-cache-${randomUUID()}`)
const db = getFirestore(app)
const userId = `activity-${randomUUID()}`
const evidenceRef = db.collection('evidence').doc(`evidence-${userId}`)
const awardRef = db.collection('awards').doc(`award-${userId}`)
const cacheRef = db.collection('activity-cache').doc(`activity: userId == ${userId}`)

async function waitForActivity(predicate) {
    const timeoutAt = Date.now() + 30_000
    while (Date.now() < timeoutAt) {
        const snapshot = await cacheRef.get()
        if (snapshot.exists && snapshot.data().version === 2) {
            const activity = JSON.parse(snapshot.data().payload)
            if (predicate(activity)) return activity
        }
        await new Promise(resolve => setTimeout(resolve, 200))
    }
    throw new Error('Timed out waiting for the trusted activity cache')
}

try {
    await evidenceRef.set({
        userId,
        projectId: 'project-1',
        evidenceUrl: 'https://example.test/evidence',
        modifier: '',
        evidenceCreatedAt: Timestamp.fromDate(new Date('2026-01-01T00:00:00Z'))
    })
    const [evidence] = await waitForActivity(activity => activity.length === 1)
    assert.deepEqual(evidence, {
        id: evidenceRef.id,
        userId,
        matchId: 'project-1',
        link: 'https://example.test/evidence',
        date: '2026-01-01T00:00:00.000Z',
        collectionDB: 'evidence',
        evidenceModifier: ''
    })

    await awardRef.set({
        userId,
        awardId: 'award-1',
        awardUrl: 'https://example.test/award',
        awardCreatedAt: Timestamp.fromDate(new Date('2026-01-02T00:00:00Z'))
    })
    const withAward = await waitForActivity(activity => activity.length === 2)
    assert.equal(withAward.find(item => item.collectionDB === 'awards').matchId, 'award-1')

    await evidenceRef.update({evidenceUrl: 'https://example.test/updated'})
    const updated = await waitForActivity(activity =>
        activity.some(item => item.link === 'https://example.test/updated'))
    assert.equal(updated.length, 2)

    await awardRef.delete()
    const withoutAward = await waitForActivity(activity => activity.length === 1)
    assert.equal(withoutAward[0].collectionDB, 'evidence')

    await evidenceRef.delete()
    assert.deepEqual(await waitForActivity(activity => activity.length === 0), [])
    console.log('Activity cache trigger emulator checks passed.')
} finally {
    await deleteApp(app)
}
