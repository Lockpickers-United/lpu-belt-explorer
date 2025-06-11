import express from 'express'
import cors from 'cors'
import fs from 'fs'
import http from 'http'
import https from 'https'
import EventEmitter from 'events'
import dayjs from 'dayjs'

import getFlickrInfo from './projects/flickrGetInfo/getFlickrInfo.js'
import saveRequest from './projects/saveRequest/saveRequest.js'
import upload from './projects/uploadContent/uploadContent.js'
import requestLock, {updateRequest, updateVotes} from './projects/rankingRequests/requestLock.js'
import handleFirebaseActivityPost from './projects/logFirebaseActivity/logFirebaseActivity.js'
import processFirebaseActivityLog from './projects/logFirebaseActivity/processFirebaseActivityLog.js'
import getRedditBelts from './projects/redditBelts/getRedditBelts.js'
//import {localUser} from '../keys/users.js'

// pm2 start /home/dh_m5s5pf/explore-lpubelts-com-node/exploreLPUbeltsServer.js --watch
// https://explore.lpubelts.com:8443/rafl-stats


//import importRaflData from './projects/importRaflData/importRaflData.js'
//import {getCharities, raflUtils} from './projects/raflFormUtilities/raflFormUtils.js'

const prod = true
const ports = prod ? {http: 8080, https: 8443} : {http: 3000, https: 3443}
const envText = prod ? '' : ' (DEV)'

const keysDir = prod
    ? `/home/${process.env.USER}/explore-lpubelts-com-node/keys`
    : `/Users/${process.env.USER}/Documents/GitHub/explore-lpubelts-com-node/keys`


//  /home/dh_m5s5pf/explore-lpubelts-com-node/keys

const privateKey = fs.readFileSync(`${keysDir}/server.key`, 'utf8')
const certificate = fs.readFileSync(`${keysDir}/server.crt`, 'utf8')
const credentials = {key: privateKey, cert: certificate}

const app = express()
app.use(cors())
app.use(express.json())

const myEmitter = new EventEmitter()
myEmitter.on('myEvent', (data) => {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss ZZ')
    console.log(timestamp, '-', data)
})

app.get('/flickr-info', async (req, res) => {
    myEmitter.emit('myEvent', 'Flickr Info')
    await getFlickrInfo(req.query.id).then(results => {
        res.send(results)
    })
})

app.get('/save-request', async (req, res) => {
    myEmitter.emit('myEvent', 'message save requested')
    try {
        await saveRequest(req, res).then()
    } catch (error) {
        console.error(error)
    }
})


app.post('/upload', async (req, res) => {
    myEmitter.emit('myEvent', 'Upload Content')
    await upload(req, res).then()
})


app.post('/request-lock', async (req, res) => {
    req.body = req.body || {}
    req.body.prod = prod
    myEmitter.emit('myEvent', 'Ranking Request submitted' + envText)
    await requestLock(req, res).then()
})

app.post('/update-request', async (req, res) => {
    req.body = req.body || {}
    req.body.prod = prod
    myEmitter.emit('myEvent', 'Ranking Request update' + envText)
    await updateRequest(req, res).then()
})

app.post('/request-vote', async (req, res) => {
    req.body.prod = prod
    myEmitter.emit('myEvent', 'Ranking Request Vote update' + envText)
    await updateVotes(req, res).then()
})

app.post('/log-activity', async (req, res) => {
    const {prod} = req.body
    const logEnvText = prod ? '' : ' (from DEV)'
    myEmitter.emit('myEvent', 'Log Firebase Activity' + logEnvText)
    handleFirebaseActivityPost(req, res)
})

app.get('/process-firebase-log', async (req, res) => {
    console.log('process-firebase-log')
    const prod = !req.query.dev
    const logEnvText = prod ? '' : ' (from DEV)'
    myEmitter.emit('myEvent', 'Process Firebase Activity Log' + logEnvText)
    await processFirebaseActivityLog(req, res).then(results => {
        return res.status(200).json(results)
    })
})


app.post('/fetch-reddit-flairs', async (req, res) => {
    myEmitter.emit('myEvent', 'Reddit flair fetch requested')
    await getRedditBelts(req, res)
})

/*

app.get('/refresh-preview', async (req, res) => {
    myEmitter.emit('myEvent', 'Preview refresh requested')
    await importRaflData().then(results => {
        res.send(results)
    })
})

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
const httpsServer = https.createServer(credentials, app)
httpServer.listen(ports.http, () => {
})
httpsServer.listen(ports.https, () => {
})

