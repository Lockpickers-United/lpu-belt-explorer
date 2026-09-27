import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {fileURLToPath} from 'node:url'
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
import {createFirebaseActivityRuntime} from './projects/logFirebaseActivity/firebaseActivityRuntime.js'
import {firebaseActivityConfigSummary} from './projects/logFirebaseActivity/firebaseActivityConfig.js'
import {createBaselineRateLimit} from './api/middleware/rateLimit.js'
import {loadRuntimeEnvironment} from './util/runtimeEnvironment.js'
import {loadServerRuntimeConfig} from './config/serverRuntimeConfig.js'
import {loadReleaseMetadata} from './util/releaseMetadata.js'
import {createReadinessController} from './util/readiness.js'
import {installProcessLifecycleHandlers} from './util/processLifecycle.js'
import {getFirebaseAdminApp} from './api/services/firebaseAdmin.js'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const publicRoot = fileURLToPath(new URL('../public/', import.meta.url))
loadRuntimeEnvironment({env: process.env, envDir: projectRoot})
const serverConfig = loadServerRuntimeConfig(process.env)
const {
    environment: env,
    trustProxy,
    corsOrigin,
    port,
    host,
    collectionStatsPath
} = serverConfig
const releaseMetadata = loadReleaseMetadata({env: process.env, projectRoot})
getFirebaseAdminApp()
const readiness = createReadinessController({
    releaseMetadata,
    environment: env,
    requiredFiles: [collectionStatsPath]
})
const isDev = env !== 'production'
const _envText = isDev ? ' (DEV)' : ''
const requestLockRuntime = await createRequestLockRuntime({env: process.env})
const uploadContentRuntime = await createUploadContentRuntime({env: process.env})
const emailFormRuntime = await createEmailFormRuntime({env: process.env})
const importRaflDataRuntime = await createImportRaflDataRuntime({env: process.env})
const redditBeltsRuntime = await createRedditBeltsRuntime({env: process.env})
const flickrInfoRuntime = await createFlickrInfoRuntime({env: process.env})
const firebaseActivityRuntime = await createFirebaseActivityRuntime({env: process.env})

// node /home/lpubelts_api/apps/api-server-dev/current/src/lpubeltsApiServer.js
// NODE_ENV=development node /home/lpubelts_api/apps/api-server-dev/current/src/lpubeltsApiServer.js

// NODE_ENV=production node /home/lpubelts_api/apps/api-server-prod/current/src/lpubeltsApiServer.js
// NODE_ENV=production pm2 restart 1 --update-env
// tail -n 200 -f /home/lpubelts_api/apps/api-server-prod/shared/logs/lpubeltsApiServer-out.log

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
app.set('trust proxy', trustProxy)
app.use(httpLogger)
app.use(requestIdHeader)

app.use(cors({origin: corsOrigin, credentials: true}))
app.use(express.static(publicRoot, {
    dotfiles: 'ignore',
    fallthrough: true,
    index: 'index.html'
}))
app.use(createBaselineRateLimit())

const apiPrefix = isDev ? '' : ''

// need to test for local or something if you want to run locally at '/api'

registerRoutes(app, {
    prefix: apiPrefix,
    requestLockHandlers: requestLockRuntime.handlers,
    uploadContentHandler: uploadContentRuntime.handler,
    emailFormHandler: emailFormRuntime.handler,
    importRaflDataHandler: importRaflDataRuntime.handler,
    getRedditBeltsHandler: redditBeltsRuntime.handler,
    getFlickrInfoHandler: flickrInfoRuntime.handler,
    firebaseActivityHandler: firebaseActivityRuntime.handler,
    readinessHandler: readiness.handler,
    enableDiagnosticRoutes: env !== 'production'
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

const server = app.listen(port, host, () => {
    readiness.markReady()
    logger.info({env, port, apiPrefix, host, corsOrigin, trustProxy}, 'SERVER STARTED')
})
installProcessLifecycleHandlers({server, readiness, logger})
logger.info(requestLockConfigSummary(requestLockRuntime.config), 'request-lock runtime configured')
logger.info(uploadContentConfigSummary(uploadContentRuntime.config), 'upload-content runtime configured')
logger.info(emailFormConfigSummary(emailFormRuntime.config), 'email-form runtime configured')
logger.info(importRaflDataConfigSummary(importRaflDataRuntime.config), 'RAFL preview runtime configured')
logger.info(redditBeltsConfigSummary(redditBeltsRuntime.config), 'Reddit belts runtime configured')
logger.info(flickrInfoConfigSummary(flickrInfoRuntime.config), 'Flickr-info runtime configured')
logger.info(firebaseActivityConfigSummary(firebaseActivityRuntime.config), 'Firebase-activity runtime configured')
