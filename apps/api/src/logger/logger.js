// logger.js
import pino from 'pino'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const require = createRequire(import.meta.url)

const isProduction = process.env.NODE_ENV === 'production' || process.env.pm_id !== undefined
const isDev = !isProduction

// custom timestamp (kept from your file)
const timestamp = () => {
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    const ts = `${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${String(now.getMilliseconds()).padStart(3,'0')}`
    return `,"time":"${ts}"`
}

const redactionConfig = {
    paths: [
        'req.headers.authorization',
        'authorization',
        'password',
        'token',
        'idToken',
        'refreshToken',
        'apiKey',
        'firebaseKey'
    ],
    censor: '[redacted]'
}

const baseLoggerOptions = {
    base: { hostname: undefined },
    redact: redactionConfig
}

/** @type {import('pino').Logger} */
let logging

if (isDev) {
    // In dev: pretty-print to console AND write to a local dev log file
    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    const devLogFile = path.resolve(__dirname, '../../logs/nodeserver-dev.log')

    const targets = []
    // Pretty console when available
    try {
        require.resolve('pino-pretty')
        targets.push({
            target: 'pino-pretty',
            options: {
                colorize: process.stdout.isTTY,
                translateTime: 'yyyy/mm/dd HH:MM:ss'
            }
        })
    } catch {
        // If pino-pretty is not installed, console will receive JSON via the default stream below
    }

    targets.push({
        target: 'pino/file',
        options: {
            destination: devLogFile,
            mkdir: true
        }
    })

    const transport = pino.transport({ targets })
    logging = pino({
        ...baseLoggerOptions,
        level: process.env.LOG_LEVEL || 'debug'
    }, transport)
} else {
    // In production, write to stdout/stderr and let PM2 capture/rotate logs.
    logging = pino({
        ...baseLoggerOptions,
        level: process.env.LOG_LEVEL || 'info',
        timestamp
    })
}

/**
 * @callback LogMethod
 * @param {string | Error | Record<string, unknown>} value
 * @param {...unknown} args
 * @returns {void}
 */

/**
 * Small application logging surface with intentionally simple method signatures.
 *
 * This keeps application call sites type-clean in IDE inspections while the
 * underlying implementation remains Pino. Prefer these call shapes:
 *
 *   logger.info('message')
 *   logger.info('value: %s', value)
 *   logger.info({value}, 'message')
 *   logger.error({err}, 'message')
 *
 * @typedef {object} AppLogger
 * @property {LogMethod} fatal
 * @property {LogMethod} error
 * @property {LogMethod} warn
 * @property {LogMethod} info
 * @property {LogMethod} debug
 * @property {LogMethod} trace
 * @property {import('pino').Logger['levels']} levels
 * @property {(bindings?: Record<string, unknown>, options?: import('pino').ChildLoggerOptions) => AppLogger} child
 */

/**
 * @param {import('pino').Logger} pinoInstance
 * @returns {AppLogger}
 */
export const createLoggerWrapper = (pinoInstance) => ({
    fatal: (value, ...args) => pinoInstance.fatal(value, ...args),
    error: (value, ...args) => pinoInstance.error(value, ...args),
    warn: (value, ...args) => pinoInstance.warn(value, ...args),
    info: (value, ...args) => pinoInstance.info(value, ...args),
    debug: (value, ...args) => pinoInstance.debug(value, ...args),
    trace: (value, ...args) => pinoInstance.trace(value, ...args),
    levels: pinoInstance.levels,
    child: (bindings = {}, options) => createLoggerWrapper(pinoInstance.child(bindings, options))
})

export const pinoLogger = logging

/** @type {AppLogger} */
export const logger = createLoggerWrapper(logging)
