// logger.js
import pino from 'pino'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const require = createRequire(import.meta.url)

const isDev = process.env.NODE_ENV !== 'production'

// custom timestamp (kept from your file)
const timestamp = () => {
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    const ts = `${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${String(now.getMilliseconds()).padStart(3,'0')}`
    return `,"time":"${ts}"`
}

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
            options: { colorize: true, translateTime: 'yyyy/MM/dd HH:mm:ss' }
        })
    } catch {
        // If pino-pretty is not installed, console will receive JSON via the default stream below
    }
    // Always write to dev log file as requested
    targets.push({
        target: 'pino/file',
        options: { destination: devLogFile, mkdir: true }
    })

    const transport = pino.transport({ targets })
    logging = pino({ level: process.env.LOG_LEVEL || 'debug', base: { hostname: undefined } }, transport)
} else {
    // Resolve log file relative to this module's directory: ../../logs/nodeserver.log
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const logFile = path.resolve(__dirname, '../../logs/nodeserver.log')

    const fileTransport = pino.transport({
        target: 'pino/file',
        options: { destination: logFile, mkdir: true }
    })
    logging = pino({ level: process.env.LOG_LEVEL || 'info', timestamp, base: { hostname: undefined } }, fileTransport)
}

export const logger = logging
