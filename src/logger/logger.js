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
    // try to resolve pino-pretty; if missing, fall back to plain JSON
    let transport
    try {
        require.resolve('pino-pretty')
        transport = { target: 'pino-pretty', options: { colorize: true, translateTime: 'yyyy/MM/dd HH:mm:ss' } }
    } catch {
        transport = undefined
    }
    logging = pino({ level: process.env.LOG_LEVEL || 'debug', transport })
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
