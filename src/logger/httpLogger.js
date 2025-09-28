// httpLogger.js
import pinoHttp from 'pino-http'
import { logger } from './logger.js'
import { randomUUID } from 'crypto'

const isDev = process.env.NODE_ENV !== 'production'

const getIp = req => {
    const xff = req.headers['x-forwarded-for']
    if (typeof xff === 'string' && xff.length) {
        // left-most is the original client
        return xff.split(',')[0].trim()
    }
    return req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip
}

export const httpLogger = pinoHttp({
    logger,
    genReqId: (req, _res) => req.headers['x-request-id'] || randomUUID(),
    redact: { paths: ['req.headers.authorization', 'req.body.password', 'req.body.token'], censor: '[redacted]' },
    customLogLevel(_req, res, err) {
        if (err || res.statusCode >= 500) return 'error'
        if (res.statusCode >= 400) return 'warn'
        return isDev ? 'info' : 'info'
    },
    serializers: {
        req(req) {
            return {
                id: req.id,
                method: req.method,
                url: (req.url || '').replaceAll('//', '/'),
                ip: getIp(req)
            }
        },
        res(res) {
            return { statusCode: res.statusCode }
        }
    },
    customErrorMessage(_req, res, err) {
        return `request failed: ${err?.message || res.statusCode}`
    }
})
