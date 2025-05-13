#!/usr/bin/env node
'use strict'

// REQUIRED MODULES
const fs = require('fs')
const path = require('path')
const url = require('url')
const useragent = require('express-useragent')

// DAYJS SETUP WITH PLUGINS
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

// CONFIGURATION
const filterInternal = false
const daysToReport = 999

// Date configuration (using YYYYMMDD format)
const startDateStr = '20230220'  // YYYYMMDD
const startDate = dayjs(startDateStr, 'YYYYMMDD')
const today = dayjs()
const endDate = today.subtract(1, 'day')
// You can override endDate if needed

// Determine if running locally by checking current directory (adjust as necessary)
const workDir = __dirname
const local = workDir.includes('nealbayless')

// Set paths based on environment
const componentsDir = local
    ? '/Users/nealbayless/Documents/GitHub/explore-lpubelts-com-node/projects/logAnalysis'
    : '/home/dh_m5s5pf/explore-lpubelts-com-node/projects/logAnalysis'

const logsPath = local
    ? '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/Log-Analysis/logs_godaddy/'
    : '/home/dh_m5s5pf/log-analysis/logs/'

const dataDir = local
    ? '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/Log-Analysis/dailyData/'
    : '/home/dh_m5s5pf/log-analysis/dailyData/'


// For mapping countries to timezones, require a JS version of your country-timezones mapping.
// Assume countryTZ is exported as a module (e.g. an object with country codes/names as keys and arrays as values).
const countryTZ = require(path.join(componentsDir, 'lpu-country-timezones.json'))

// Arrays for processing
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const ignoreFiles = ['.', '..', '.DS_Store', 'New Folder With Items']

// GLOBAL VARIABLES
let logLines = 0
let stats = {}  // Will be keyed by requestDate (YYYY-MM-DD)
let temp = {}   // Temporary storage for min/max times and IP addresses
let duplicateLockViews = 0 // eslint-disable-line
let duplicateLockViewsByDate = {}

let previousLockViewed = {} // To track duplicate lock views per IP

// Crawler agents arrays (filled later)
let crawlerAgents = []
let crawlerAgentNames = {}

// Helper function to load crawler user agents from a JSON file.
function getCrawlerUserAgents(jsonPath) {
    try {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
        data.forEach(crawler => {
            crawler.instances.forEach(agent => {
                crawlerAgents.push(agent)
                crawlerAgentNames[agent] = crawler.pattern
            })
        })
    } catch (err) {
        console.error('Error reading crawler user agents from', jsonPath, err)
    }
}

// Load crawler agents from both JSON files
getCrawlerUserAgents(path.join(componentsDir, 'crawler-user-agents.json'))
getCrawlerUserAgents(path.join(componentsDir, 'crawler-user-agents-LPU.json'))

// READ LOG FILE NAMES
let allLogFiles = fs.readdirSync(logsPath)
let logFiles = allLogFiles.filter(file => !ignoreFiles.includes(file)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

// READ DATA FILE NAMES from dataDir (we only need the date portion from filenames)
let allDataFiles = fs.readdirSync(dataDir)
let dataFiles = []
allDataFiles.forEach(file => {
    if (ignoreFiles.includes(file)) return
    let parts = file.split('_')
    if (parts.length > 0) {
        dataFiles.push(parts[0])
    }
})

// PROCESS EACH LOG FILE
logFiles.forEach(logFileName => {
    const fullLogPath = path.join(logsPath, logFileName)
    const logContent = fs.readFileSync(fullLogPath, 'utf8')
    const lines = logContent.split('\n')

    lines.forEach(line => {
        if (!line.trim()) return
        logLines++
        // Collapse multiple spaces into one
        line = line.replace(/\s+/g, ' ')

        // Parse the line using regex (similar to the Perl capture)
        // Regex: clientAddress rfc1413 username [localTime] "httpRequest" statusCode bytesSent "referer" "clientSoftware"
        const logRegex = /^(\S+) (\S+) (\S+) \[(.+?)\] "(.+?)" (\S+) (\S+) "(.*?)" "(.*?)"/
        const match = logRegex.exec(line)
        if (!match) return

        let [
            , clientAddress,
            //rfc1413,
            //username,
            localTime,
            httpRequest,
            //statusCode,
            //bytesSentToClient,
            referer,
            clientSoftware
        ] = match

        // Filter out specific referers
        if (referer === 'http://localhost:3000/') return

        if (filterInternal) {
            if (referer === 'https://github.com/NiXXeD/lpu-belt-explorer/blob/main/src/data/data.json' ||
                referer === 'https://github.com/Lockpickers-United/lpu-belt-explorer/blob/main/src/data/data.json' ||
                referer === 'https://images.lpubelts.com/lpubelts-images-by-lock.html' ||
                ['71.105.242.55', '71.247.6.65', '100.37.88.15', '45.48.21.72', '75.168.138.35'].includes(clientAddress)
            ) {
                return
            }
        }

        // Split httpRequest into parts
        const httpParts = httpRequest.split(' ')
        if (httpParts.length < 2) return
        const fileRequested = httpParts[1]

        // Only process if fileRequested contains '/i/'
        if (!fileRequested.match(/\/i\//i)) return

        // DATE PROCESSING
        // localTime is something like: "13/Jan/2024:08:36:07 -0700"
        const [datePart, ...timeParts] = localTime.split(':')
        // datePart: "13/Jan/2024"
        const [requestDay, requestMonth, requestYear] = datePart.split('/')
        // Reconstruct full time string: e.g., "08:36:07"
        const timeString = timeParts.slice(0, 3).join(':')
        // Using dayjs custom format to parse the date-time string
        const requestDateTimeFull = dayjs(`${requestDay} ${requestMonth} ${requestYear} ${timeString}`, 'DD MMM YYYY HH:mm:ss')
        const requestDateText = `${requestYear}-${('0' + (months.indexOf(requestMonth) + 1)).slice(-2)}-${('0' + requestDay).slice(-2)}`
        const requestDate = dayjs(requestDateText, 'YYYY-MM-DD')

        // Filter out dates outside our range
        if (requestDate.isBefore(startDate) || requestDate.isAfter(endDate)) return
        // Also skip if too old compared to today and daysToReport
        if (today.diff(requestDate, 'day') > daysToReport) return
        // Skip processing if a data file already exists for this date
        if (dataFiles.includes(requestDateText)) return

        // Initialize stats for this date if not already done
        if (!stats[requestDateText]) {
            stats[requestDateText] = { logEntries: 0, date: requestDateText }
            temp[requestDateText] = { ipAddresses: {} }
        }
        stats[requestDateText].logEntries++
        // Update min and max times
        if (!temp[requestDateText].minTime || requestDateTimeFull.isBefore(temp[requestDateText].minTime))
            temp[requestDateText].minTime = requestDateTimeFull
        if (!temp[requestDateText].maxTime || requestDateTimeFull.isAfter(temp[requestDateText].maxTime))
            temp[requestDateText].maxTime = requestDateTimeFull

        // Process crawler agents based on clientSoftware
        if (clientSoftware.match(/google/i) || clientSoftware.match(/ahrefs/i) || clientSoftware.match(/facebookexternalhit/i)) {
            const crawlerName = crawlerAgentNames[clientSoftware] || clientSoftware
            stats[requestDateText].crawlerAgentRequests = stats[requestDateText].crawlerAgentRequests || {}
            stats[requestDateText].crawlerAgentRequests[crawlerName] = (stats[requestDateText].crawlerAgentRequests[crawlerName] || 0) + 1
            return
        }
        if (crawlerAgentNames[clientSoftware]) {
            stats[requestDateText].crawlerAgentRequests = stats[requestDateText].crawlerAgentRequests || {}
            const name = crawlerAgentNames[clientSoftware]
            stats[requestDateText].crawlerAgentRequests[name] = (stats[requestDateText].crawlerAgentRequests[name] || 0) + 1
            return
        }

        // Check for duplicate lock view requests if fileRequested contains clear.gif?id=
        if (fileRequested.match(/\/i\/clear\.gif\?id=/i)) {
            // Only check duplicate views for a specific date range (e.g. Jan 7 to Jan 14, 2024)
            const startDT = dayjs('2024-01-07', 'YYYY-MM-DD')
            const endDT = dayjs('2024-01-14', 'YYYY-MM-DD')
            if (requestDateTimeFull.isAfter(startDT) && requestDateTimeFull.isBefore(endDT.add(1, 'day'))) {
                // Extract uniqueID from query parameter id
                const idMatch = fileRequested.match(/id=([\w\d]+)/)
                const uniqueID = idMatch ? idMatch[1] : ''
                if (previousLockViewed[clientAddress] === uniqueID) {
                    stats.duplicateLockViews = (stats.duplicateLockViews || 0) + 1
                    duplicateLockViews++
                    duplicateLockViewsByDate[requestDateText] = (duplicateLockViewsByDate[requestDateText] || 0) + 1
                    return
                }
                previousLockViewed[clientAddress] = uniqueID
            }
        }

        // GEOLOOKUP using geoip-lite
        const geo = require('geoip-lite').lookup(clientAddress)
        // Increment IP counter
        temp[requestDateText].ipAddresses[clientAddress] = (temp[requestDateText].ipAddresses[clientAddress] || 0) + 1

        let requestCountry = geo ? geo.country : 'Unknown'
        let requestState = geo && geo.region ? geo.region : undefined
        // Adjust country names as in Perl code
        if (requestCountry === 'HK') requestCountry = 'Hong Kong'
        if (requestCountry === 'VN') requestCountry = 'Vietnam'
        if (requestCountry === 'KR') requestCountry = 'Republic of Korea'

        stats[requestDateText].continents = stats[requestDateText].continents || {}
        let requestContinent = (countryTZ[requestCountry] && countryTZ[requestCountry][1]) || 'Unknown'
        stats[requestDateText].continents[requestContinent] = (stats[requestDateText].continents[requestContinent] || 0) + 1

        stats[requestDateText].countries = stats[requestDateText].countries || {}
        stats[requestDateText].countries[requestCountry] = (stats[requestDateText].countries[requestCountry] || 0) + 1

        if (requestState && requestCountry === 'US') {
            stats[requestDateText].states = stats[requestDateText].states || {}
            stats[requestDateText].states[requestState] = (stats[requestDateText].states[requestState] || 0) + 1
        }

        // PARSE BEACON REQUESTS
        const parsedUrl = url.parse(fileRequested, true)
        const query = parsedUrl.query
        const trkString = query.trk
        const pageString = query.page
        const screenWidthString = query.w
        const refString = query.ref
        let cleanReferrerString = refString ? refString.replace(/(https:\/\/lpubelts\.com\/).*/, '$1') : undefined
        if (cleanReferrerString) {
            stats[requestDateText].referrerViews = stats[requestDateText].referrerViews || {}
            stats[requestDateText].referrerViews[cleanReferrerString] = (stats[requestDateText].referrerViews[cleanReferrerString] || 0) + 1
        }

        // Handle various endpoints based on fileRequested
        if (fileRequested.match(/\/i\/lpu\.gif/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            if (trkString === 'dial') {
                const idMatch = fileRequested.match(/id=([\w\d]+)/)
                const uniqueID = idMatch ? idMatch[1] : ''
                stats[requestDateText].lockViewsById = stats[requestDateText].lockViewsById || {}
                stats[requestDateText].lockViewsById[uniqueID] = (stats[requestDateText].lockViewsById[uniqueID] || 0) + 1
                stats[requestDateText].lockViewsByCountry = stats[requestDateText].lockViewsByCountry || {}
                stats[requestDateText].lockViewsByCountry[requestCountry] = (stats[requestDateText].lockViewsByCountry[requestCountry] || 0) + 1
                stats[requestDateText].lockViewsByWidth = stats[requestDateText].lockViewsByWidth || {}
                stats[requestDateText].lockViewsByWidth[screenWidthString] = (stats[requestDateText].lockViewsByWidth[screenWidthString] || 0) + 1
            } else {
                stats[requestDateText].pageViews = stats[requestDateText].pageViews || {}
                stats[requestDateText].pageViews[trkString] = (stats[requestDateText].pageViews[trkString] || 0) + 1
                stats[requestDateText].pageViews.total = (stats[requestDateText].pageViews.total || 0) + 1
            }
            if (pageString) {
                let cleanPage = pageString.replace(/https:\/\/lpubelts\.com\/\?.*#\/(\w+).*/, '$1')
                if (trkString === 'error') {
                    stats[requestDateText].errorPages = stats[requestDateText].errorPages || {}
                    stats[requestDateText].errorPages[cleanPage] = (stats[requestDateText].errorPages[cleanPage] || 0) + 1
                }
            }
        } else if (fileRequested.match(/\/i\/rafl\.gif\?id=\d{4}-\d{3}/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            const idMatch = fileRequested.match(/id=(\d{4}-\d{3})/)
            const uniqueID = idMatch ? idMatch[1] : ''
            stats[requestDateText].raflPotViewsById = stats[requestDateText].raflPotViewsById || {}
            stats[requestDateText].raflPotViewsById[uniqueID] = (stats[requestDateText].raflPotViewsById[uniqueID] || 0) + 1
            stats[requestDateText].raflPotViewsByCountry = stats[requestDateText].raflPotViewsByCountry || {}
            stats[requestDateText].raflPotViewsByCountry[requestCountry] = (stats[requestDateText].raflPotViewsByCountry[requestCountry] || 0) + 1
            if (cleanReferrerString) {
                stats[requestDateText].referrerPotViews = stats[requestDateText].referrerPotViews || {}
                stats[requestDateText].referrerPotViews[cleanReferrerString] = (stats[requestDateText].referrerPotViews[cleanReferrerString] || 0) + 1
            }
            stats[requestDateText].totalRaflPotViews = (stats[requestDateText].totalRaflPotViews || 0) + 1
        } else if (fileRequested.match(/\/i\/lock\.png\?id=/i)) {
            const idMatch = fileRequested.match(/id=([\w\d]+)/)
            const uniqueID = idMatch ? idMatch[1] : ''
            stats[requestDateText].seoViewsById = stats[requestDateText].seoViewsById || {}
            stats[requestDateText].seoViewsById[uniqueID] = (stats[requestDateText].seoViewsById[uniqueID] || 0) + 1
        } else if (fileRequested.match(/\/i\/clear\.gif/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            const idMatch = fileRequested.match(/id=([\w\d]+)/)
            const uniqueID = idMatch ? idMatch[1] : ''
            stats[requestDateText].lockViewsById = stats[requestDateText].lockViewsById || {}
            stats[requestDateText].lockViewsById[uniqueID] = (stats[requestDateText].lockViewsById[uniqueID] || 0) + 1
            stats[requestDateText].lockViewsByCountry = stats[requestDateText].lockViewsByCountry || {}
            stats[requestDateText].lockViewsByCountry[requestCountry] = (stats[requestDateText].lockViewsByCountry[requestCountry] || 0) + 1
            if (screenWidthString) {
                stats[requestDateText].lockViewsByWidth = stats[requestDateText].lockViewsByWidth || {}
                stats[requestDateText].lockViewsByWidth[screenWidthString] = (stats[requestDateText].lockViewsByWidth[screenWidthString] || 0) + 1
            }
            stats[requestDateText].lockViewsByIP = stats[requestDateText].lockViewsByIP || {}
            stats[requestDateText].lockViewsByIP[clientAddress] = (stats[requestDateText].lockViewsByIP[clientAddress] || 0) + 1
            if (cleanReferrerString) {
                stats[requestDateText].referrerLockViews = stats[requestDateText].referrerLockViews || {}
                stats[requestDateText].referrerLockViews[cleanReferrerString] = (stats[requestDateText].referrerLockViews[cleanReferrerString] || 0) + 1
            }
        } else if (fileRequested.match(/\/i\/welcome\.gif/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            stats[requestDateText].visits = (stats[requestDateText].visits || 0) + 1
            stats[requestDateText].visitsByCountry = stats[requestDateText].visitsByCountry || {}
            stats[requestDateText].visitsByCountry[requestCountry] = (stats[requestDateText].visitsByCountry[requestCountry] || 0) + 1
            if (cleanReferrerString) {
                stats[requestDateText].referrerWelcomeViews = stats[requestDateText].referrerWelcomeViews || {}
                stats[requestDateText].referrerWelcomeViews[cleanReferrerString] = (stats[requestDateText].referrerWelcomeViews[cleanReferrerString] || 0) + 1
            }
        }

        // USER AGENT PROCESSING
        let uaResult = useragent.parse(clientSoftware)
        let uaPlatform = uaResult.os || 'Other'
        let uaBrowser = uaResult.browser || 'Other'
        stats[requestDateText].platforms = stats[requestDateText].platforms || {}
        stats[requestDateText].platforms[uaPlatform] = (stats[requestDateText].platforms[uaPlatform] || 0) + 1
        stats[requestDateText].browsers = stats[requestDateText].browsers || {}
        stats[requestDateText].browsers[uaBrowser] = (stats[requestDateText].browsers[uaBrowser] || 0) + 1

        // LOCAL REQUEST TIME ADJUSTMENT
        // Assume server time zone is America/New_York
        const serverTZ = 'America/New_York'
        const serverOffset = dayjs().tz(serverTZ).utcOffset() // in minutes

        if (countryTZ[requestCountry]) {
            let tzName = countryTZ[requestCountry][0] || serverTZ
            let dt = requestDateTimeFull.tz(tzName)
            let localOffset = dayjs().tz(tzName).utcOffset()
            let hourOffset = (localOffset - serverOffset) / 60
            // Add the hour offset to get the adjusted time
            let adjustedDT = dt.add(hourOffset, 'hour')
            let localHour = adjustedDT.format('HH')

            stats[requestDateText].requestsByLocalHour = stats[requestDateText].requestsByLocalHour || {}
            stats[requestDateText].requestsByLocalHour[localHour] = (stats[requestDateText].requestsByLocalHour[localHour] || 0) + 1
            stats[requestDateText].requestsByServerHour = stats[requestDateText].requestsByServerHour || {}
            stats[requestDateText].requestsByServerHour[requestDateTimeFull.format('HH')] = (stats[requestDateText].requestsByServerHour[requestDateTimeFull.format('HH')] || 0) + 1
        }
    }) // end for each line
}) // end for each log file

// FINALIZE STATS: add minTime, maxTime, and visitors count per day
Object.keys(temp).forEach(requestDateText => {
    stats[requestDateText].minTime = temp[requestDateText].minTime.format()
    stats[requestDateText].maxTime = temp[requestDateText].maxTime.format()
    stats[requestDateText].visitors = Object.keys(temp[requestDateText].ipAddresses).length
})

// WRITE JSON OUTPUT FILES per date
Object.keys(temp).forEach(requestDateText => {
    let minTimeStr = temp[requestDateText].minTime.format('HHmm')
    let maxTimeStr = temp[requestDateText].maxTime.format('HHmm')
    let filename = `${requestDateText}_${minTimeStr}-${maxTimeStr}.json`
    let outputPath = path.join(dataDir, filename)
    fs.writeFileSync(outputPath, JSON.stringify(stats[requestDateText], null, 2), 'utf8')
})

// RUNTIME INFO
console.log(`Data Process Runtime: ${String(dayjs().diff(today, 'minute')).padStart(2, '0')}:${String(dayjs().diff(today, 'second')).padStart(2, '0')}.${String(dayjs().diff(today, 'millisecond')).substring(0,2)}`)
console.log(`Processed ${logLines} log entries`)



// Optionally, use a system command to announce completion (macOS only)
if (local) {
    const { exec } = require('child_process')
    exec("say 'analysis complete'")
}
