import admin from 'firebase-admin'
import {getFirestore} from 'firebase-admin/firestore'

import serviceAccount from '../../keys/service-account.json' with {type: 'json'}

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
}, 'lpubelts-dev')
const db = getFirestore(app, 'lpubelts-dev')

export default async function updateRequest(req, res) {

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send('Unauthorized')
    }

    // Extract token from header
    const idToken = authHeader.split('Bearer ')[1]

    // Verify the ID token
    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            if (decodedToken.admin || decodedToken.requestAdmin) {
                req.user = decodedToken // Attach decoded token to request object
                const ref = db.collection('ranking-requests-accepted').doc(req.body.entry.id);
                ref.set(req.body.entry)
                    .then(() => {
                        console.log('Request updated successfully')
                    })
                    .catch((error) => {
                        console.error('Error writing document: ', error)
                    });
                res.json({message: 'Request updated successfully'})
            } else {
                console.log('Insufficient permissions')
                res.status(403).send({error: 'Insufficient permissions'})
            }

        })
        .catch(err => {
            console.error('Token verification failed:', err)
            res.status(403).send({error: 'Unauthorized'})
        })
}
