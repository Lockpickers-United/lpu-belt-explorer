import express from 'express'
import cors from 'cors'
import fs from 'fs'
import http from 'http'
import https from 'https'
import EventEmitter from 'events'

import importRaflData from './projects/importRaflData/importRaflData.js'
import getFlickrInfo from './projects/flickrGetInfo/getFlickrInfo.js'
import {getCharities, raflUtils} from './projects/raflFormUtilities/raflFormUtils.js'

// pm2 start /home/dh_m5s5pf/explore-lpubelts-com-node/exploreLPUbeltsServer.js --watch
// https://explore.lpubelts.com:8443/rafl-stats

const privateKey = fs.readFileSync('./keys/server.key', 'utf8')
const certificate = fs.readFileSync('./keys/server.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}

const app = express()
app.use(cors())

const myEmitter = new EventEmitter()
myEmitter.on('myEvent', (data) => {
    console.log('Event triggered:', data)
})

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

app.get('/flickr-info', async (req, res) => {
    myEmitter.emit('myEvent', 'Flickr info requested')
    await getFlickrInfo(req.query.id).then(results => {
        res.send(results)
    })
})

app.get('/test', async (req, res) => {
    myEmitter.emit('myEvent', 'Flickr info requested')
    res.send({msg: 'test'})
})



/////////////

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)
httpServer.listen(8080, () => {
})
httpsServer.listen(8443, () => {
})

