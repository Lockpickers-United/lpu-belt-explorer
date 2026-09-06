// httpLogger.js
import pinoHttp from 'pino-http'
import { pinoLogger } from './logger.js'
import { randomUUID } from 'crypto'

const isProduction = process.env.NODE_ENV === 'production' || process.env.pm_id !== undefined

const getIp = req => {
    const xff = req.headers['x-forwarded-for']
    if (typeof xff === 'string' && xff.length) {
        // left-most is the original client
        return xff.split(',')[0].trim()
    }
    return req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip
}

export const getHttpLogLevel = (req, res, err, {production = isProduction} = {}) => {
    if (err || res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    if (production && req.method === 'OPTIONS') return 'silent'
    return 'info'
}

export const httpLogger = pinoHttp({
    logger: pinoLogger,
    genReqId: (req, _res) => req.headers['x-request-id'] || randomUUID(),
    redact: { paths: ['req.headers.authorization', 'req.body.password', 'req.body.token'], censor: '[redacted]' },
    customLogLevel(req, res, err) {
        return getHttpLogLevel(req, res, err)
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
