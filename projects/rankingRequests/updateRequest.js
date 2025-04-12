import admin from 'firebase-admin'
import {getFirestore} from 'firebase-admin/firestore'

import serviceAccount from '../../keys/service-account.json' with {type: 'json'}

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
}, 'lpubelts-dev')
const db = getFirestore(app, 'lpubelts-dev')
db.settings({ignoreUndefinedProperties: true})

function handleError(res, message, error, status = 500) {
    console.error(message, error)
    res.status(status).send({status, message})
}

export async function updateVotes(req, res) {
    const {entryId} = req.body
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send('Unauthorized')
    }
    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const {user_id} = decodedToken
    const ref = db.collection('ranking-requests').doc(entryId)
    let updatedUserIds = []

    try {
        const rankingRequest = await ref.get()
        const userIds = rankingRequest.data().requestedBy || []
        if (userIds.includes(user_id)) {
            console.log('already requested by', user_id)
            updatedUserIds = userIds.filter(id => id !== user_id)
        } else {
            updatedUserIds = Array.from(new Set([...userIds, user_id]))
        }
        await ref.update({requestedBy: updatedUserIds})

    } catch (error) {
        console.error('Error reading existing request: ', error)
        return handleError(res, 'Database read error', error)
    }

    console.log('done')
    return res.status(200).json(updatedUserIds)
}

export default async function updateRequest(req, res) {

    const {entry} = req.body

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send('Unauthorized')
    }
    const idToken = authHeader.split('Bearer ')[1]

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        if (!decodedToken.admin && !decodedToken.requestAdmin) {
            return handleError(res, 'Insufficient permissions', new Error('Insufficient Permissions'), 403)
        }
        req.user = decodedToken
    } catch (err) {
        return handleError(res, 'Token verification failed', err, 403)
    }

    try {
        const ref = db.collection('ranking-requests').doc(entry.id)
        await ref.set(entry)
        console.log('Request updated successfully')
    } catch (error) {
        console.error('Error writing document: ', error)
        return handleError(res, 'Database write error', error)
    }

    console.log('done')
    return res.status(200).json(entry)
}