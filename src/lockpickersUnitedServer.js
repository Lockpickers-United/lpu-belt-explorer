import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import {logger} from './logger/logger.js'
import {httpLogger} from './logger/httpLogger.js'
import {requestIdHeader} from './logger/requestId.js'
import {registerRoutes} from './routes.js'

const env = process.env.NODE_ENV || 'development'
dotenv.config({path: [`.env.${process.env.NODE_ENV}`]})
const isDev = env !== 'production'

const app = express()
app.disable('etag')
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({limit: '200kb'}))
app.use((req, _res, next) => {
    req.url = req.url.replace(/\/{2,}/g, '/')
    if (!isDev && req.body) req.body.prod = true
    next()
})
app.set('trust proxy', true)
app.use(httpLogger)
app.use(requestIdHeader)

const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
    : true
app.use(cors({origin: corsOrigin, credentials: true}))

const envText = isDev ? ' (DEV)' : ''
const apiPort = isDev ? 4000 : 9082
const apiPrefix = isDev ? '/api' : ''

registerRoutes(app, { prefix: apiPrefix })

// Additional routes
app.get(`${apiPrefix}/readyOld`, (_req, res) => {
    logger.info({route: '/ready'}, `ok ${envText}`)
    res.json({ready: true})
})

const port = apiPort
const host = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => {
    logger.info({env, port, host, corsOrigin}, 'api listening') // use pino, not console
    console.log({env, port, host, corsOrigin}, 'api listening')
})