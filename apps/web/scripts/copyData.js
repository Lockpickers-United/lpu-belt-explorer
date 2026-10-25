import fs from 'fs'
import fetch from 'node-fetch'
import * as dataUrls from '../src/data/dataUrls.js'
import path from 'path'

if (!fs.existsSync('./public/data')) fs.mkdirSync('./public/data')

const promises = Object.keys(dataUrls).map(async key => {
    const url = dataUrls[key]
    const fileName = path.parse(url).base
    const fullPath = path.join('./public/data', fileName)

    console.log('Fetching', url)
    const response = await fetch(url)
    const data = await response.json()

    console.log('Writing local data', fullPath)
    fs.writeFileSync(fullPath, JSON.stringify(data))
})

await Promise.all(promises)

console.log('Done')
