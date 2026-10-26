import {logger} from '../../logger/logger.js'

const log = logger.child({module: 'reddit-belts-auth'})

export default function requireLpuAdmin(req, _res, next) {
    if (req.user?.lpuAdmin === true) return next()

    log.warn({requestId: req.id, uid: req.user?.uid}, 'Reddit belt refresh access denied')
    const error = new Error('LPU administrator access required')
    error.status = 403
    error.code = 'lpu_admin_required'
    return next(error)
}
