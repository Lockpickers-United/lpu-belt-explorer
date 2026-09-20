#!/usr/bin/env node

// REQUIRED MODULES
import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'
import {fileURLToPath, parse as parseUrl} from 'url'
import useragent from 'express-useragent'
import geoipLite from 'geoip-lite'
import {setDeepAdd} from '../../util/setDeep.js'

// DAYJS SETUP WITH PLUGINS
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

// CONFIGURATION
const filterInternal = false
const daysToReport = 9999

// Date configuration (using YYYYMMDD format)
const startDateStr = '20230220'  // YYYYMMDD
const startDate = dayjs(startDateStr, 'YYYYMMDD')
const today = dayjs()
const endDate = today.subtract(1, 'day')
// You can override endDate if needed

// Determine if running locally by checking current directory (adjust as necessary)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workDir = __dirname
const local = workDir.includes('nealbayless')

// Set paths based on environment
const componentsDir = local
    ? '/Users/nealbayless/Documents/GitHub/explore-lpubelts-com-node/src/projects/logAnalysis'
    : '/home/dh_m5s5pf/explore-lpubelts-com-node/src/projects/logAnalysis'

const logsPath = local
    ? '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/Log-Analysis/logs_godaddy/'
    : '/home/dh_m5s5pf/log-analysis/logs/'

const dataDir = local
    ? '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/Log-Analysis/dailyData/'
    : '/home/dh_m5s5pf/log-analysis/dailyData/'

// For mapping countries to timezones, load the JSON mapping from the log-analysis components directory.
const countryTZ = JSON.parse(fs.readFileSync(path.join(componentsDir, 'lpu-country-timezones.json'), 'utf8'))

// Arrays for processing
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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

    //console.log('processing log file:', fullLogPath, 'with', lines.length, 'lines')

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
            _,
            clientAddress,
            _rfc1413,
            _username,
            localTime,
            httpRequest,
            _statusCode,
            _bytesSentToClient,
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
            stats[requestDateText] = {date: requestDateText}
            temp[requestDateText] = {ipAddresses: {}}
        }
        setDeepAdd(stats, [requestDateText, 'logEntries'], 1)
        // Update min and max times
        if (!temp[requestDateText].minTime || requestDateTimeFull.isBefore(temp[requestDateText].minTime))
            temp[requestDateText].minTime = requestDateTimeFull
        if (!temp[requestDateText].maxTime || requestDateTimeFull.isAfter(temp[requestDateText].maxTime))
            temp[requestDateText].maxTime = requestDateTimeFull

        // Process crawler agents based on clientSoftware
        if (clientSoftware.match(/google/i) || clientSoftware.match(/ahrefs/i) || clientSoftware.match(/facebookexternalhit/i)) {
            const crawlerName = crawlerAgentNames[clientSoftware] || clientSoftware
            setDeepAdd(stats, [requestDateText, 'crawlerAgentRequests', crawlerName], 1)
            return
        }
        if (crawlerAgentNames[clientSoftware]) {
            const name = crawlerAgentNames[clientSoftware]
            setDeepAdd(stats, [requestDateText, 'crawlerAgentRequests', name], 1)
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
                    setDeepAdd(stats, ['duplicateLockViews'], 1)
                    duplicateLockViews++
                    setDeepAdd(duplicateLockViewsByDate, [requestDateText], 1)
                    return
                }
                previousLockViewed[clientAddress] = uniqueID
            }
        }

        // GEOLOOKUP using geoip-lite
        const geo = geoipLite.lookup(clientAddress)
        // Increment IP counter
        setDeepAdd(temp, [requestDateText, 'ipAddresses', clientAddress], 1)

        let requestCountry = geo ? geo.country : 'Unknown'
        let requestState = geo && geo.region ? geo.region : undefined
        // Adjust country names as in Perl code
        if (requestCountry === 'HK') requestCountry = 'Hong Kong'
        if (requestCountry === 'VN') requestCountry = 'Vietnam'
        if (requestCountry === 'KR') requestCountry = 'Republic of Korea'

        let requestContinent = (countryTZ[requestCountry] && countryTZ[requestCountry][1]) || 'Unknown'
        setDeepAdd(stats, [requestDateText, 'continents', requestContinent], 1)

        setDeepAdd(stats, [requestDateText, 'countries', requestCountry], 1)

        if (requestState && requestCountry === 'US') {
            setDeepAdd(stats, [requestDateText, 'states', requestState], 1)
        }

        // PARSE BEACON REQUESTS
        const parsedUrl = parseUrl(fileRequested, true)
        const query = parsedUrl.query
        const trkString = query.trk?.trim()
        const pageString = query.page?.trim()
        const screenWidthString = query.w?.trim()
        const refString = query.ref?.trim()
        const ownerString = query.own?.trim()
        const searchTerm = query.search?.trim().toLowerCase()
        let cleanReferrerString = refString ? refString.replace(/(https:\/\/lpubelts\.com\/).*/, '$1').trim() : undefined
        if (cleanReferrerString) {
            setDeepAdd(stats, [requestDateText, 'referrerViews', cleanReferrerString], 1)
        }

        // Handle various endpoints based on fileRequested
        if (fileRequested.match(/\/i\/lpu\.gif/i)) {
            setDeepAdd(stats, [requestDateText, 'beacons'], 1)
            if (trkString === 'dial') {
                const idMatch = fileRequested.match(/id=([\w\d]+)/)
                const uniqueID = idMatch ? idMatch[1] : ''
                setDeepAdd(stats, [requestDateText, 'lockViewsById', uniqueID], 1)
                setDeepAdd(stats, [requestDateText, 'lockViewsByCountry', requestCountry], 1)
                setDeepAdd(stats, [requestDateText, 'lockViewsByWidth', screenWidthString], 1)
            } else {
                if (['profile', 'scorecard'].includes(trkString)) {
                    const owner = ownerString
                        ? ownerString === 'true' ? 'Own' : 'Other'
                        : ''
                    setDeepAdd(stats, [requestDateText, 'pageViews', `${trkString}${owner}`], 1)
                } else {
                    setDeepAdd(stats, [requestDateText, 'pageViews', trkString], 1)
                }
                setDeepAdd(stats, [requestDateText, 'pageViews', 'total'], 1)
            }
            if (pageString) {
                let cleanPage = pageString.replace(/https:\/\/lpubelts\.com\/\?.*#\/(\w+).*/, '$1')
                if (trkString === 'error') {
                    setDeepAdd(stats, [requestDateText, 'errorPages', cleanPage], 1)
                }
            }
        } else if (fileRequested.match(/\/i\/rafl\.gif\?id=\d{4}-\d{3}/i)) {
            setDeepAdd(stats, [requestDateText, 'beacons'], 1)
            const idMatch = fileRequested.match(/id=(\d{4}-\d{3})/)
            const uniqueID = idMatch ? idMatch[1] : ''
            setDeepAdd(stats, [requestDateText, 'raflPotViewsById', uniqueID], 1)
            setDeepAdd(stats, [requestDateText, 'raflPotViewsByCountry', requestCountry], 1)
            if (cleanReferrerString) {
                setDeepAdd(stats, [requestDateText, 'referrerPotViews', cleanReferrerString], 1)
            }
            setDeepAdd(stats, [requestDateText, 'totalRaflPotViews'], 1)
        } else if (fileRequested.match(/\/i\/lock\.png\?id=/i)) {
            const idMatch = fileRequested.match(/id=([\w\d]+)/)
            const uniqueID = idMatch ? idMatch[1] : ''
            setDeepAdd(stats, [requestDateText, 'seoViewsById', uniqueID], 1)
        } else if (fileRequested.match(/\/i\/clear\.gif/i)) {
            setDeepAdd(stats, [requestDateText, 'beacons'], 1)
            const idMatch = fileRequested.match(/id=([\w\d]+)/)
            const uniqueID = idMatch ? idMatch[1] : ''
            setDeepAdd(stats, [requestDateText, 'lockViewsById', uniqueID], 1)
            setDeepAdd(stats, [requestDateText, 'lockViewsByCountry', requestCountry], 1)
            if (screenWidthString) {
                setDeepAdd(stats, [requestDateText, 'lockViewsByWidth', screenWidthString], 1)
            }
            if (searchTerm && requestDate.isAfter(dayjs('2025-10-30', 'YYYY-MM-DD'))) {
                setDeepAdd(stats, [requestDateText, 'lockViewsBySearch', searchTerm], 1)
            }
            setDeepAdd(stats, [requestDateText, 'lockViewsByIP', clientAddress], 1)
            if (cleanReferrerString) {
                setDeepAdd(stats, [requestDateText, 'referrerLockViews', cleanReferrerString], 1)
            }
        } else if (fileRequested.match(/\/i\/welcome\.gif/i)) {
            setDeepAdd(stats, [requestDateText, 'beacons'], 1)
            setDeepAdd(stats, [requestDateText, 'visits'], 1)
            setDeepAdd(stats, [requestDateText, 'visitsByCountry', requestCountry], 1)
            if (cleanReferrerString) {
                setDeepAdd(stats, [requestDateText, 'referrerWelcomeViews', cleanReferrerString], 1)
            }
        } else if (fileRequested.match(/\/i\/srch\.gif/i)) {
            if (searchTerm && requestDate.isAfter(dayjs('2025-10-30', 'YYYY-MM-DD'))) {
                setDeepAdd(stats, [requestDateText, 'completedSearches', searchTerm], 1)
            }
        }

        // USER AGENT PROCESSING
        let uaResult = useragent.parse(clientSoftware)
        let uaPlatform = uaResult.os || 'Other'
        let uaBrowser = uaResult.browser || 'Other'
        setDeepAdd(stats, [requestDateText, 'platforms', uaPlatform], 1)
        setDeepAdd(stats, [requestDateText, 'browsers', uaBrowser], 1)

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

            setDeepAdd(stats, [requestDateText, 'requestsByLocalHour', localHour], 1)
            setDeepAdd(stats, [requestDateText, 'requestsByServerHour', requestDateTimeFull.format('HH')], 1)
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
//console.log(`Data Process Runtime: ${String(dayjs().diff(today, 'minute')).padStart(2, '0')}:${String(dayjs().diff(today, 'second')).padStart(2, '0')}.${String(dayjs().diff(today, 'millisecond')).substring(0, 2)}`)
//console.log(`Processed ${logLines} log entries`)


// Optionally, use a system command to announce completion (macOS only)
if (local) {
    exec('say \'analysis complete\'')
}
