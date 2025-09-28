import express from 'express'
import cors from 'cors'
import fs from 'fs'
import http from 'http'
import https from 'https'
import EventEmitter from 'events'
import dayjs from 'dayjs'

//import saveRequest from './projects/saveRequest/saveRequest.js'
// Heavy feature modules are now loaded on-demand within route handlers to reduce baseline memory.
// requestLock/updateRequest/updateVotes -> dynamic import
// handleFirebaseActivityPost -> dynamic import
// processFirebaseActivityLog -> dynamic import
// getRedditBelts -> dynamic import
// fetchFlairs -> dynamic import
import {prodUser} from '../keys/users.js'

// pm2 start /home/dh_m5s5pf/explore-lpubelts-com-node/exploreLPUbeltsServer.js --watch
// https://explore.lpubelts.com:8443/rafl-stats

//import importRaflData from './projects/importRaflData/importRaflData.js'
//import {getCharities, raflUtils} from './projects/raflFormUtilities/raflFormUtils.js'

const prod = true
const ports = prod ? {http: 8080, https: 8443} : {http: 3000, https: 3443}
const envText = prod ? '' : ' (DEV)'

const productionServer = process.env.USER === prodUser
const keysDir = productionServer
    ? `/home/${process.env.USER}/explore-lpubelts-com-node/keys`
    : `/Users/${process.env.USER}/Documents/GitHub/explore-lpubelts-com-node/keys`

const app = express()
// Normalize multiple slashes in URL path (e.g., //services///path -> /services/path)
app.use((req, _res, next) => {
    if (typeof req.url === 'string' && req.url.includes('//')) {
        req.url = req.url.replace(/\/{2,}/g, '/')
    }
    next()
})
app.disable('etag')
app.disable('x-powered-by')
app.use(cors())
app.use(express.json({ limit: '200kb' }))
const largeJson = express.json({ limit: '2mb' })

const myEmitter = new EventEmitter()
myEmitter.on('myEvent', (data) => {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss ZZ')
    console.log(timestamp, '-', data)
})

app.get('/flickr-info', async (req, res) => {
    myEmitter.emit('myEvent', 'Flickr Info')
    const { default: getFlickrInfo } = await import('./projects/flickrGetInfo/getFlickrInfo.js')
    const results = await getFlickrInfo(req.query.id)
    res.send(results)
})

app.post('/upload', async (req, res) => {
    myEmitter.emit('myEvent', 'Upload Content')
    const { default: upload } = await import('./projects/uploadContent/uploadContent.js')
    await upload(req, res)
})

app.post('/request-lock', async (req, res) => {
    req.body ||= {}
    req.body.prod = prod
    myEmitter.emit('myEvent', 'Ranking Request submitted' + envText)
    const { default: requestLock } = await import('./projects/requestLock/requestLock.js')
    await requestLock(req, res)
})

app.post('/update-request', async (req, res) => {
    req.body = req.body || {}
    req.body.prod = prod
    myEmitter.emit('myEvent', 'Ranking Request update' + envText)
    const { updateRequest } = await import('./projects/requestLock/requestLock.js')
    await updateRequest(req, res)
})

app.post('/request-vote', async (req, res) => {
    req.body.prod = prod
    myEmitter.emit('myEvent', 'Ranking Request Vote update' + envText)
    const { updateVotes } = await import('./projects/requestLock/requestLock.js')
    await updateVotes(req, res)
})

app.post('/log-activity', largeJson, async (req, res) => {
    const {prod} = req.body
    const logEnvText = prod ? '' : ' (from DEV)'
    myEmitter.emit('myEvent', 'Log Firebase Activity' + logEnvText)
    const { default: handleFirebaseActivityPost } = await import('./projects/logFirebaseActivity/logFirebaseActivity.js')
    await handleFirebaseActivityPost(req, res)
})

app.get('/process-firebase-log', async (req, res) => {
    console.log('process-firebase-log')
    const prod = !req.query.dev
    const logEnvText = prod ? '' : ' (from DEV)'
    myEmitter.emit('myEvent', 'Process Firebase Activity Log' + logEnvText)
    const { default: processFirebaseActivityLog } = await import('./projects/logFirebaseActivity/processFirebaseActivityLog.js')
    const results = await processFirebaseActivityLog(req, res)
    return res.status(200).json(results)
})

app.post('/fetch-reddit-flairs', async (req, res) => {
    // gets ALL flairs and saves to redditBeltCounts.json & redditUserFlairs.json
    myEmitter.emit('myEvent', 'Reddit flair fetch requested')
    const { default: getRedditBelts } = await import('./projects/redditBelts/getRedditBelts.js')
    await getRedditBelts(req, res)
})

app.post('/fetch-flairs', async (req, res) => {
    // gets flairs for specific userId from fliarLog.json saved by LockyJr
    const userId = req?.body?.userId || ''
    myEmitter.emit('myEvent', `Reddit flair fetch for user ${userId} requested`)
    const { default: fetchFlairs } = await import('./projects/fetchFlairs/fetchFlairs.js')
    await fetchFlairs(req, res)
})

/*

app.get('/update-rafl-form', async (req, res) => {
    myEmitter.emit('myEvent', 'RAFL form update requested')
    await raflUtils('addQuestions').then(results => {
        res.send(results)
    })
})

app.get('/rafl-charities', async (req, res) => {
    myEmitter.emit('myEvent', 'Rafl charities requested')
    await raflUtils('getCharities').then(results => {
        res.send(results)
    })
})

app.get('/rafl-stats', async (req, res) => {
    myEmitter.emit('myEvent', 'Rafl STATS requested')
    await raflUtils('getSheetsResponses').then(results => {
        res.send(results)
    })
})
*/

/////////////

const httpServer = http.createServer(app)
// Reduce idle memory and long-lived sockets
httpServer.keepAliveTimeout = 5000
httpServer.headersTimeout = 6000
httpServer.requestTimeout = 10000

httpServer.listen(ports.http, () => {})

// Only spin up HTTPS in prod and load TLS keys as Buffers
if (prod) {
    const privateKey = fs.readFileSync(`${keysDir}/server.key`)
    const certificate = fs.readFileSync(`${keysDir}/server.crt`)
    const credentials = { key: privateKey, cert: certificate }
    const httpsServer = https.createServer(credentials, app)
    httpsServer.keepAliveTimeout = 5000
    httpsServer.headersTimeout = 6000
    httpsServer.requestTimeout = 10000
    httpsServer.listen(ports.https, () => {})
}