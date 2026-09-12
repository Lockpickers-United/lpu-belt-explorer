import {logger} from '../../logger/logger.js'

const log = logger.child({module: 'rafl-preview-auth'})

export default function requireRaflAdmin(req, _res, next) {
    if (req.user?.raflAdmin === true) return next()

    log.warn({requestId: req.id, uid: req.user?.uid}, 'RAFL preview access denied')
    const error = new Error('RAFL administrator access required')
    error.status = 403
    error.code = 'rafl_admin_required'
    return next(error)
}
