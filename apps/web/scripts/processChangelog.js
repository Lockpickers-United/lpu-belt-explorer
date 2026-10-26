import fs from 'node:fs'
import {initializeApp, cert, deleteApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {collectionPatch, collectionTypes, prepareUpdates} from './processChangelogPlan.js'

///////////////////////////////////////////////////////////////////////////
//   '--database=dev' | '--database=prod' // '--dry-run' | '--write'    //

let localArgs = undefined
localArgs = ['--database=dev', '--dry-run']

/////////////////////////////////////////////////////////////////////////////
//  Paste the "process change data" export from the Changelog page here.  //
//
//  const updates = { changes: [], deletions: [] }

const updates = { changes: [], deletions: [] }


// Every run, including a dry run, reads live Firestore and requires approval.
// Run with --database=dev or --database=prod and exactly one of --dry-run or --write.

function parseOptions(args) {
    const databaseOptions = args.filter(arg => arg.startsWith('--database='))
    const modes = args.filter(arg => arg === '--dry-run' || arg === '--write')
    if (args.length !== 2 || databaseOptions.length !== 1 || modes.length !== 1 ||
        !['--database=dev', '--database=prod'].includes(databaseOptions[0])) {
        throw new Error('Usage: node scripts/processChangelog.js --database=dev|prod --dry-run|--write')
    }
    return {database: databaseOptions[0].slice('--database='.length), write: modes[0] === '--write'}
}

function chunks(values, size) {
    const result = []
    for (let index = 0; index < values.length; index += size) result.push(values.slice(index, index + size))
    return result
}

async function findDocuments(db, collection, field, operator, ids) {
    const documents = new Map()
    for (const group of chunks(ids, 30)) {
        const snapshot = await db.collection(collection).where(field, operator, group).get()
        snapshot.forEach(doc => documents.set(doc.ref.path, doc))
    }
    return documents
}

async function findCollections(db, ids) {
    const documents = new Map()
    for (const type of collectionTypes) {
        const matching = await findDocuments(db, 'lockcollections', type, 'array-contains-any', ids)
        for (const [path, doc] of matching) documents.set(path, doc)
    }
    return documents
}

async function runLimited(documents, callback) {
    for (const group of chunks(documents, 10)) {
        const results = await Promise.allSettled(group.map(callback))
        const failure = results.find(result => result.status === 'rejected')
        if (failure) throw failure.reason
    }
}

function validUserId(value) {
    return typeof value === 'string' && value.length > 0 && value.trim() === value && !value.includes('/')
}

async function applyEvidence(db, documents, plan) {
    await runLimited(documents, doc => db.runTransaction(async transaction => {
        const current = await transaction.get(doc.ref)
        if (!current.exists) return
        const oldId = current.data().projectId
        const newId = plan.changes.get(oldId)
        if (!newId) return
        const userId = current.data().userId
        if (!validUserId(userId)) throw new Error(`Evidence ${doc.ref.path} has no valid userId`)
        transaction.update(doc.ref, {projectId: newId})
        transaction.delete(db.collection('activity-cache').doc(`activity: userId == ${userId}`))
    }))
}

async function applyCollections(db, documents, plan) {
    await runLimited(documents, doc => db.runTransaction(async transaction => {
        const current = await transaction.get(doc.ref)
        if (!current.exists) return
        const patch = collectionPatch(current.data(), plan)
        if (Object.keys(patch).length > 0) transaction.update(doc.ref, patch)
    }))
}

async function main() {
    const options = parseOptions(process.argv.slice(2)?.length ? process.argv.slice(2) : localArgs)
    const plan = prepareUpdates(updates)
    if (plan.targetIds.length === 0) {
        console.log('No approved changes or deletions to process')
        return
    }

    // Resolve relative to this script, independent of the caller's working directory.
    const serviceAccount = JSON.parse(fs.readFileSync(new URL('../../../keys/lpu-belt-explorer-firebase-adminsdk.json', import.meta.url), 'utf8'))
    if (serviceAccount.project_id !== 'lpu-belt-explorer') throw new Error('Unexpected service account project')
    const app = initializeApp({credential: cert(serviceAccount)})

    try {
        const db = options.database === 'dev' ? getFirestore(app, 'lpubelts-dev') : getFirestore(app)
        console.log(`${options.write ? 'WRITE' : 'DRY RUN'}: ${options.database} database`)
        console.log(`${plan.changes.size} approved Sameline changes; ${plan.deletions.size} approved deletions\n`)

        const evidence = plan.changes.size > 0
            ? await findDocuments(db, 'evidence', 'projectId', 'in', [...plan.changes.keys()])
            : new Map()
        const collections = await findCollections(db, plan.targetIds)

        // Check all queried documents before any write. Transactions recheck current values.
        for (const doc of evidence.values()) {
            if (!validUserId(doc.data().userId)) throw new Error(`Evidence ${doc.ref.path} has no valid userId`)
            console.log(`evidence ${doc.ref.path}: ${doc.data().projectId} -> ${plan.changes.get(doc.data().projectId)}`)
        }
        for (const doc of collections.values()) {
            const patch = collectionPatch(doc.data(), plan)
            console.log(`lockcollections ${doc.ref.id}: ${Object.keys(patch).join(', ')}`)
        }
        console.log(`\n${evidence.size} evidence documents; ${collections.size} collection documents`)

        if (!options.write) return
        try {
            await applyEvidence(db, [...evidence.values()], plan)
            await applyCollections(db, [...collections.values()], plan)
        } catch (error) {
            throw new Error('Writes may be partial; review a fresh dry run before retrying', {cause: error})
        }
        console.log('Writes complete. Verify with a separately approved dry run.')
    } finally {
        await deleteApp(app)
    }
}

main().catch(error => {
    console.error('Changelog processing failed:', error)
    process.exitCode = 1
})
