// httpLogger.js
import pinoHttp from 'pino-http'
import { pinoLogger } from './logger.js'
import { randomUUID } from 'crypto'

const isProduction = process.env.NODE_ENV === 'production' || process.env.pm_id !== undefined

const appMountPrefixes = ['', '/services', '/servicesDev']
const appRoutePrefixes = [
    '/api',
    '/flickr-info',
    '/upload',
    '/request-lock',
    '/update-request',
    '/request-vote',
    '/fetch-reddit-flairs',
    '/fetch-flairs',
    '/refresh-preview',
    '/log-activity',
    '/process-firebase-log',
    '/email-form',
    '/health',
    '/ready',
    '/echo',
    '/boom'
]
export const loggedApplicationRoutePrefixes = appMountPrefixes.flatMap((mountPrefix) => (
    appRoutePrefixes.map((routePrefix) => `${mountPrefix}${routePrefix}`)
))

const getIp = req => {
    const xff = req.headers['x-forwarded-for']
    if (typeof xff === 'string' && xff.length) {
        // left-most is the original client
        return xff.split(',')[0].trim()
    }
    return req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip
}

export const getRequestPathname = (req) => {
    const url = req.originalUrl || req.url || '/'
    const normalizedUrl = url.replace(/^\/{2,}/, '/')

    try {
        return new URL(normalizedUrl, 'http://localhost').pathname.replace(/\/{2,}/g, '/')
    } catch {
        return normalizedUrl.split('?')[0].replace(/\/{2,}/g, '/') || '/'
    }
}

export const isApplicationRoutePath = (pathname) => (
    loggedApplicationRoutePrefixes.some((routePrefix) => (
        pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)
    ))
)

export const shouldAutoLogRequest = (req, {production = isProduction} = {}) => (
    !production || isApplicationRoutePath(getRequestPathname(req))
)

export const getHttpLogLevel = (req, res, err, {production = isProduction} = {}) => {
    if (err || res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    if (production && req.method === 'OPTIONS') return 'silent'
    return 'info'
}

export const httpLogger = pinoHttp({
    logger: pinoLogger,
    autoLogging: {
        ignore: (req) => !shouldAutoLogRequest(req)
    },
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
