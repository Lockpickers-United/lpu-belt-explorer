import admin from 'firebase-admin'


export default async function authenticateRequest(req) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized')
    }
    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    if (!decodedToken) {
        throw new Error('Insufficient permissions')
    }
    return decodedToken
}
