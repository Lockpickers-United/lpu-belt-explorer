import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import {logger} from './logger/logger.js'
import {httpLogger} from './logger/httpLogger.js'
import {requestIdHeader} from './logger/requestId.js'
import {registerRoutes} from './routes.js'
import normalizeRequestUrl from './util/normalizeRequestUrl.js'
import {createRequestLockRuntime} from './projects/requestLock/requestLockRuntime.js'
import {requestLockConfigSummary} from './projects/requestLock/requestLockConfig.js'
import {createUploadContentRuntime} from './projects/uploadContent/uploadContentRuntime.js'
import {uploadContentConfigSummary} from './projects/uploadContent/uploadContentConfig.js'
import {createEmailFormRuntime} from './projects/emailFormContents/emailFormContentsRuntime.js'
import {emailFormConfigSummary} from './projects/emailFormContents/emailFormContentsConfig.js'
import {createImportRaflDataRuntime} from './projects/importRaflData/importRaflDataRuntime.js'
import {importRaflDataConfigSummary} from './projects/importRaflData/importRaflDataConfig.js'
import {createRedditBeltsRuntime} from './projects/redditBelts/redditBeltsRuntime.js'
import {redditBeltsConfigSummary} from './projects/redditBelts/redditBeltsConfig.js'
import {createFlickrInfoRuntime} from './projects/flickrGetInfo/flickrInfoRuntime.js'
import {flickrInfoConfigSummary} from './projects/flickrGetInfo/flickrInfoConfig.js'

const env = process.env.NODE_ENV || 'local'
dotenv.config({path: [`.env.${env}`], quiet: true})
const isDev = env !== 'production'
const _envText = isDev ? ' (DEV)' : ''
const requestLockRuntime = await createRequestLockRuntime({env: process.env})
const uploadContentRuntime = await createUploadContentRuntime({env: process.env})
const emailFormRuntime = await createEmailFormRuntime({env: process.env})
const importRaflDataRuntime = await createImportRaflDataRuntime({env: process.env})
const redditBeltsRuntime = await createRedditBeltsRuntime({env: process.env})
const flickrInfoRuntime = await createFlickrInfoRuntime({env: process.env})
logger.info(requestLockConfigSummary(requestLockRuntime.config), 'request-lock runtime configured')
logger.info(uploadContentConfigSummary(uploadContentRuntime.config), 'upload-content runtime configured')
logger.info(emailFormConfigSummary(emailFormRuntime.config), 'email-form runtime configured')
logger.info(importRaflDataConfigSummary(importRaflDataRuntime.config), 'RAFL preview runtime configured')
logger.info(redditBeltsConfigSummary(redditBeltsRuntime.config), 'Reddit belts runtime configured')
logger.info(flickrInfoConfigSummary(flickrInfoRuntime.config), 'Flickr-info runtime configured')

// node /home/dh_m5s5pf/explore-lpubelts-com-node/src/exploreLPUbeltsServerDEV.js

// NODE_ENV=production node /home/dh_m5s5pf/explore-lpubelts-com-node/src/exploreLPUbeltsServer.js
// NODE_ENV=production pm2 restart 1 --update-env
// tail -n 200 -f /home/dh_m5s5pf/explore-lpubelts-com-node/logs/nodeserver.log

const app = express()
app.use(normalizeRequestUrl)

app.disable('etag')
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({limit: '200kb'}))
app.use((req, _res, next) => {
    req.runtimeProduction = !isDev
    next()
})
app.set('trust proxy', true)
app.use(httpLogger)
app.use(requestIdHeader)

const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
    : true
app.use(cors({origin: corsOrigin, credentials: true}))

const apiPort = isDev ? 8081 : 8080
const apiPrefix = isDev ? '' : ''

// need to test for local or something if you want to run locally at '/api'

registerRoutes(app, {
    prefix: apiPrefix,
    requestLockHandlers: requestLockRuntime.handlers,
    uploadContentHandler: uploadContentRuntime.handler,
    emailFormHandler: emailFormRuntime.handler,
    importRaflDataHandler: importRaflDataRuntime.handler,
    getRedditBeltsHandler: redditBeltsRuntime.handler,
    getFlickrInfoHandler: flickrInfoRuntime.handler
})

// 404 handler (must be after routes)
app.use((req, res) => {
    if (res.headersSent) return
    res.status(404).json({
        error: 'Not Found',
        path: req.originalUrl || req.url,
        method: req.method,
        requestId: req.id
    })
})

// Centralized error handler (must be after routes and 404)
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err)
    const status = err?.status || err?.statusCode || 500
    const base = {
        message: err?.message || 'Internal Server Error',
        code: err?.code,
        requestId: req.id,
        path: req.originalUrl || req.url,
        method: req.method
    }
    const payload = isDev
        ? { ...base, stack: typeof err?.stack === 'string' ? err.stack : undefined, details: err?.details }
        : base
    const cleanErr = {...err}
    delete cleanErr.stack
    try { logger.error({ err: cleanErr, status, ...base }, 'request error') } catch {
        console.error('request error', err)
    }
    res.status(status).json({ error: payload })
})

// Prevent process from exiting on unhandled errors; log them instead
process.on('unhandledRejection', (reason) => {
    try { logger.error({ reason }, 'unhandledRejection') } catch { console.error('unhandledRejection', reason) }
})
process.on('uncaughtException', (err) => {
    try { logger.error({ err }, 'uncaughtException') } catch { console.error('uncaughtException', err) }
})

const port = apiPort
const host = process.env.HOST || '0.0.0.0'

const server = app.listen(port, host, () => {
    logger.info({env, port, apiPrefix, host, corsOrigin}, 'SERVER STARTED')
})
server.on('error', (err) => {
    try { logger.error({ err }, 'server error') } catch { console.error('server error', err) }
})
