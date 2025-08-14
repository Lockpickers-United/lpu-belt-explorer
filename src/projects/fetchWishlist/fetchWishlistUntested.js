#!/usr/bin/env node
import { readFileSync } from 'fs'
import { URLSearchParams } from 'url'
import path from 'path'

// ————— CONFIGURATION —————
const workPath = '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/Collections+Profile/process-leaderboard-server'
const defaultQuery = 'token=07034c0f&id=GGplAdctTfVDLVvYsfIADJmfp8f2'
const orgs = new Map([
    ['81750a99', 'LPUlocks.com'],
    ['07034c0f', 'LocksportBazaar']
])

// ————— PARSE QUERY STRING —————
const rawQS = process.env.QUERY_STRING || defaultQuery
const params = new URLSearchParams(rawQS.startsWith('?') ? rawQS.slice(1) : rawQS)
const token = params.get('token')
const id = params.get('id')

// prepare the output array
const outputData = []

// ————— EMIT CGI HEADER —————
console.log('Content-Type: application/json\n')

// ————— UNAUTHORIZED CHECK —————
const org = orgs.get(token)
if (!org) {
    const info = [
        'UNAUTHORIZED',
        `Token: ${token}`,
        'Token Holder: NOT FOUND',
        'All requests are logged and monitored.'
    ]
    outputData.push(info)
    outputData.push({ status: '401 Unauthorized' })
    console.log(JSON.stringify(outputData, null, 2))
    process.exit(0)
}

// ————— LOAD BACKUP JSON —————
let data
const backupFile = path.join(workPath, 'backup.json')
try {
    const fileContents = readFileSync(backupFile, 'utf8')
    data = JSON.parse(fileContents)
} catch (err) {
    console.log(`ERROR opening ${backupFile}\n`)
    process.exit(1)
}

// ————— PROFILE LOOKUP —————
const profile = data.__collections__?.lockcollections?.[id]
if (!profile) {
    const info = [
        'NO SUCH USER',
        `Token: ${token}`,
        `Token Holder: ${org}`,
        'All requests are logged and monitored.'
    ]
    outputData.push(info)
    outputData.push({ status: '418 No Such User' })
    console.log(JSON.stringify(outputData, null, 2))
    process.exit(0)
}

// ————— BUILD SUCCESS RESPONSE —————
const wishlist = profile.wishlist
const info = [
    'This is proprietary data and may not be used without express written permission.',
    'We require any entities using using this data in any way ...ts.com Privacy Policy, found at https://lpubelts.com/#/privacy',
    `Token: ${token}`,
    `Token Holder: ${org}`,
    'All requests are logged and monitored.'
]
const wishlistData = { id, wishlist, status: '200 OK' }

outputData.push(info, wishlistData)
console.log(JSON.stringify(outputData, null, 2))
