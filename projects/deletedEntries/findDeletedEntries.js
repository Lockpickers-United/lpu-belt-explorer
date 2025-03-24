#!/usr/bin/env node
'use strict'

// REQUIRED MODULES
import fs from 'fs'
import path from 'path'

// DAYJS SETUP WITH PLUGINS
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

dayjs.extend(customParseFormat)

import entryName from '../util/entryName.js'
import {localUser} from '../../keys/users.js'

// CONFIGURATION
const ignoreFiles = ['.', '..', '.DS_Store']

const dataDir = `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/gitVersions`
const outDir = `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer`

let allFiles = fs.readdirSync(dataDir)
let files = allFiles.filter(file => !ignoreFiles.includes(file)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

//let previousData = JSON.parse(fs.readFileSync(path.join(dataDir, files[0]), 'utf8'))
let previousData = []

const historicalData = files.reduce((acc, file) => {
    const date = dayjs(file.substring(0, 24), 'YYYY-MM-DD_HH-mm-ssZZ').toISOString()

    //'YYYY-MM-DD_HH-mm-ssZZ'
    //2025-03-18_13-49-44+0000

    const fullFilePath = path.join(dataDir, file)
    const fileData = JSON.parse(fs.readFileSync(fullFilePath, 'utf8'))

    fileData.forEach(entry => {
        const previousEntry = previousData.find(e => e.id === entry.id)
        const name = entryName(entry, 'short')
        if (!previousEntry && !acc[entry.id]) {
            acc[entry.id] = {...entry, name, dateAdded: date}
        } else if (acc[entry.id]) {
            delete acc[entry.id].dateDeleted
            acc[entry.id] = {...acc[entry.id], ...entry}
        }
    })
    previousData.forEach(entry => {
        const currentEntry = fileData.find(e => e.id === entry.id)
        if (!currentEntry) {
            acc[entry.id] = {...acc[entry.id], dateDeleted: date}
        }
    })

    previousData = fileData
    return acc
}, {})

Object.keys(historicalData).forEach(id => {
    if (historicalData[id].dateDeleted) {
        console.log('deleted', historicalData[id])
    }
})

const json_text = JSON.stringify(historicalData, null, 2)
fs.writeFileSync(`${outDir}/historicalData.json`, json_text, 'utf8')

