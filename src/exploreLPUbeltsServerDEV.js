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
//const envText = isDev ? ' (DEV)' : ''

// NODE_ENV=production node /home/dh_m5s5pf/explore-lpubelts-com-node/src/exploreLPUbeltsServerDEV.js
// NODE_ENV=production pm2 restart 4 --update-env
// tail -f /home/dh_m5s5pf/explore-lpubelts-com-node/logs/nodeserver.log

const app = express()
app.use((req, _res, next) => {
    if (typeof req.url === 'string' && req.url.includes('//')) {
        req.url = req.url.replace(/\/{2,}/g, '/')
    }
    next()
})
app.disable('etag')
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({limit: '200kb'}))
app.set('trust proxy', true)
app.use(httpLogger)
app.use(requestIdHeader)

const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
    : true
app.use(cors({origin: corsOrigin, credentials: true}))

const apiPort = isDev ? 8081 : 8081
const apiPrefix = isDev ? '' : ''

// need to test for local or something if you want to run locally at '/api'

registerRoutes(app, { prefix: apiPrefix })

const port = apiPort
const host = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => {
    logger.info({env, port, apiPrefix, host, corsOrigin}, 'api listening') // use pino, not console
    console.log({env, port, apiPrefix, host, corsOrigin}, 'api listening')
})