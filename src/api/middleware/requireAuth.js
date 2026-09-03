export default async function requireAuth(req, _res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('Unauthorized')
            err.status = 401
            err.code = 'unauthorized'
            throw err
        }

        const idToken = authHeader.slice('Bearer '.length).trim()
        if (!idToken) {
            const err = new Error('Unauthorized')
            err.status = 401
            err.code = 'unauthorized'
            throw err
        }

        const {verifyFirebaseIdToken} = await import('../services/firebaseAdmin.js')
        req.user = await verifyFirebaseIdToken(idToken)
        return next()
    } catch (err) {
        if (!err.status) {
            err.status = 401
            err.code = err.code || 'invalid_token'
        }
        return next(err)
    }
}
