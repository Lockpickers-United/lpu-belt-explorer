#!/usr/bin/env node
'use strict'

import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'

// DAYJS SETUP
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekOfYear)

// --- CONFIGURATION ---
const daysToReport = 777
const startDate = dayjs('2023-02-20')
const today = dayjs()
const endDate = today.subtract(1, 'day')

// Determine if running locally based on current directory path
import {localUser, prodUser} from '../../../keys/users.js'
const local = process.env.USER === localUser

// Set paths based on environment
const componentsDir = local
    ? `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/Log-Analysis`
    : `/home/${prodUser}/explore-lpubelts-com-node/projects/logAnalysis`

const dataPath = local
    ? `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/Log-Analysis/dailyData/`
    : `/home/${prodUser}/log-analysis/dailyData/`

const serverPath = local
    ? `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/Log-Analysis`
    : `/home/${prodUser}/explore.lpubelts.com/public/data`

const siteStatsFullJsonFile = path.join(serverPath, 'statsSiteFullNew.json')

// Load country time zone mapping (must export an object)
const countryTZ = path.join(componentsDir, 'lpu-country-timezones.json')

// Load lock details from JSON feed (module must export lockDetailsNewPM)


import { lockDetailsNewPM } from "./getLockDetails.js";

let lockDetailsNew
await lockDetailsNewPM().then(data => {
    lockDetailsNew = data
}).catch(err => {
    console.error("Error:", err);
});

// --- DATA AGGREGATION OBJECTS ---
let wip = {} // work-in-progress aggregates
wip.totals = {}
wip.totals.numDays = 0
wip.totals.visits = 0
wip.totals.visitors = 0
wip.totals.totalLockViews = 0
wip.totals.totalPotViews = 0

wip.days = {}         // keyed by date string "YYYY-MM-DD"
wip.weeks = {}        // keyed by first day of week (YYYY-MM-DD)
wip.lockViewsById = {}
wip.raflPotViewsById = {}
wip.referrerPotViews = {}
wip.raflPotViewsByCountry = {}
wip.visitsByCountry = {}
wip.firstVisit = {}   // country => first date seen
wip.lockViewsByCountry = {}
wip.states = {}
wip.lockViewsByWidth = {}
wip.referrerWelcomeViews = {}
wip.referrerLockViews = {}
wip.referrerViews = {}
wip.seoLockById = {}
wip.browsers = {}
wip.platforms = {}
wip.crawlerAgentRequests = {}
wip.requestsByLocalHour = {}
wip.requestsByServerHour = {}

// Also keep a separate aggregate for lockViews (used later for printing)
let lockViews = {}

// --- HELPER FUNCTIONS ---

// Parse the date from a filename. Assumes filenames start with "YYYY-MM-DD"
function getDateStringFromFilename(filename) {
    const match = filename.match(/(\d{4}-\d{2}-\d{2})/)
    return match ? match[1] : null
}

// --- MAIN PROCESSING: Read daily data files and aggregate ---
const dataFiles = fs.readdirSync(dataPath)
    .filter(file => !['.', '..', '.DS_Store', 'New Folder With Items'].includes(file))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

for (const file of dataFiles) {
    const dateString = getDateStringFromFilename(file)
    if (!dateString) continue

    const requestDate = dayjs(dateString, 'YYYY-MM-DD')
    // Skip if out of range
    if (requestDate.isAfter(endDate) || requestDate.isBefore(startDate)) continue
    if (today.diff(requestDate, 'day') > daysToReport) continue

    const filePath = path.join(dataPath, file)
    let dayData = {}
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        dayData = JSON.parse(content)
    } catch (err) {
        console.error('Error reading or parsing', filePath, err)
        continue
    }

    // Determine week key using week number and first day of week
    const firstDay = dayjs(requestDate).startOf("week").format('YYYY-MM-DD')
    
    // Initialize aggregates for this day and week if needed
    if (!wip.days[dateString]) {
        wip.days[dateString] = {}
    }
    if (!wip.weeks[firstDay]) {
        wip.weeks[firstDay] = {numDays: 0, visits: 0, visitors: 0, totalLockViews: 0}
    }
    wip.totals.numDays++
    wip.weeks[firstDay].numDays++

    // PRIMARY METRICS aggregation
    wip.days[dateString].visits = dayData.visits
    wip.weeks[firstDay].visits = (wip.weeks[firstDay].visits || 0) + dayData.visits
    wip.totals.visits += dayData.visits

    wip.days[dateString].visitors = dayData.visitors
    wip.weeks[firstDay].visitors = (wip.weeks[firstDay].visitors || 0) + dayData.visitors
    wip.totals.visitors += dayData.visitors

    // Process lockViewsById
    if (dayData.lockViewsById) {

        for (const key in dayData.lockViewsById) {
            const count = dayData.lockViewsById[key]
            wip.lockViewsById[key] = (wip.lockViewsById[key] || 0) + count
            lockViews[key] = (lockViews[key] || 0) + count

            // Use lockDetailsNew to get belt for the lock
            const lockBelt = (lockDetailsNew[key] && lockDetailsNew[key].belt)
                ?  lockDetailsNew[key].belt
                : 'Unranked'

            wip.lockViewsByBelt = wip.lockViewsByBelt || {}
            wip.lockViewsByBelt[lockBelt] = (wip.lockViewsByBelt[lockBelt] || 0) + count

            wip.days[dateString].totalLockViews = (wip.days[dateString].totalLockViews || 0) + count
            wip.weeks[firstDay].totalLockViews = (wip.weeks[firstDay].totalLockViews || 0) + count
            wip.totals.totalLockViews += count
        }
    }

    // Process raflPotViewsById
    if (dayData.raflPotViewsById) {
        for (const key in dayData.raflPotViewsById) {
            const count = dayData.raflPotViewsById[key]
            wip.raflPotViewsById[key] = (wip.raflPotViewsById[key] || 0) + count
            wip.totals.totalPotViews += count
        }
    }

    // Process referrerPotViews
    if (dayData.referrerPotViews) {
        for (const key in dayData.referrerPotViews) {
            const count = dayData.referrerPotViews[key]
            wip.referrerPotViews[key] = (wip.referrerPotViews[key] || 0) + count
        }
    }

    // Process raflPotViewsByCountry
    if (dayData.raflPotViewsByCountry) {
        for (const key in dayData.raflPotViewsByCountry) {
            const count = dayData.raflPotViewsByCountry[key]
            wip.raflPotViewsByCountry[key] = (wip.raflPotViewsByCountry[key] || 0) + count
        }
    }

    // Process pageViews
    if (dayData.pageViews) {
        wip.days[dateString].pageViews = wip.days[dateString].pageViews || {}
        for (const key in dayData.pageViews) {
            wip.days[dateString].pageViews[key] = (wip.days[dateString].pageViews[key] || 0) + dayData.pageViews[key]
        }
    }

    // Process errorPages
    if (dayData.errorPages) {
        wip.errorPages = wip.errorPages || {}
        for (const key in dayData.errorPages) {
            wip.errorPages[key] = (wip.errorPages[key] || 0) + dayData.errorPages[key]
        }
    }

    // Process continents
    if (dayData.continents) {
        wip.continents = wip.continents || {}
        for (const key in dayData.continents) {
            wip.continents[key] = (wip.continents[key] || 0) + dayData.continents[key]
        }
    }

    // Process visitsByCountry and firstVisit
    if (dayData.visitsByCountry) {
        wip.visitsByCountry = wip.visitsByCountry || {}
        for (const key in dayData.visitsByCountry) {
            wip.visitsByCountry[key] = (wip.visitsByCountry[key] || 0) + dayData.visitsByCountry[key]
            // Set first visit if not set or if this date is earlier
            if (!wip.firstVisit[key] || requestDate.isBefore(dayjs(wip.firstVisit[key], 'YYYY-MM-DD'))) {
                wip.firstVisit[key] = dateString
            }
        }
    }

    // Process lockViewsByCountry
    if (dayData.lockViewsByCountry) {
        wip.lockViewsByCountry = wip.lockViewsByCountry || {}
        for (const key in dayData.lockViewsByCountry) {
            wip.lockViewsByCountry[key] = (wip.lockViewsByCountry[key] || 0) + dayData.lockViewsByCountry[key]
        }
    }

    // Process states
    if (dayData.states) {
        wip.states = wip.states || {}
        for (const key in dayData.states) {
            wip.states[key] = (wip.states[key] || 0) + dayData.states[key]
        }
    }

    // Process lockViewsByWidth
    if (dayData.lockViewsByWidth) {
        wip.lockViewsByWidth = wip.lockViewsByWidth || {}
        for (const key in dayData.lockViewsByWidth) {
            wip.lockViewsByWidth[key] = (wip.lockViewsByWidth[key] || 0) + dayData.lockViewsByWidth[key]
        }
    }

    // Process referrerWelcomeViews
    if (dayData.referrerWelcomeViews) {
        wip.referrerWelcomeViews = wip.referrerWelcomeViews || {}
        for (const key in dayData.referrerWelcomeViews) {
            wip.referrerWelcomeViews[key] = (wip.referrerWelcomeViews[key] || 0) + dayData.referrerWelcomeViews[key]
        }
    }

    // Process referrerLockViews
    if (dayData.referrerLockViews) {
        wip.referrerLockViews = wip.referrerLockViews || {}
        for (const key in dayData.referrerLockViews) {
            wip.referrerLockViews[key] = (wip.referrerLockViews[key] || 0) + dayData.referrerLockViews[key]
        }
    }

    // Process referrerViews
    if (dayData.referrerViews) {
        wip.referrerViews = wip.referrerViews || {}
        for (const key in dayData.referrerViews) {
            wip.referrerViews[key] = (wip.referrerViews[key] || 0) + dayData.referrerViews[key]
        }
    }

    // Process seoViewsById
    if (dayData.seoViewsById) {
        wip.seoLockById = wip.seoLockById || {}
        for (const key in dayData.seoViewsById) {
            wip.seoLockById[key] = (wip.seoLockById[key] || 0) + dayData.seoViewsById[key]
        }
    }

    // Process browsers
    if (dayData.browsers) {
        for (const key in dayData.browsers) {
            wip.browsers[key] = (wip.browsers[key] || 0) + dayData.browsers[key]
        }
    }

    // Process platforms
    if (dayData.platforms) {
        for (const key in dayData.platforms) {
            wip.platforms[key] = (wip.platforms[key] || 0) + dayData.platforms[key]
        }
    }

    // Process crawlerAgentRequests
    if (dayData.crawlerAgentRequests) {
        for (const key in dayData.crawlerAgentRequests) {
            wip.crawlerAgentRequests[key] = (wip.crawlerAgentRequests[key] || 0) + dayData.crawlerAgentRequests[key]
        }
    }

    // Process requestsByLocalHour and requestsByServerHour
    if (dayData.requestsByLocalHour) {
        for (const key in dayData.requestsByLocalHour) {
            wip.requestsByLocalHour[key] = (wip.requestsByLocalHour[key] || 0) + dayData.requestsByLocalHour[key]
        }
    }
    if (dayData.requestsByServerHour) {
        for (const key in dayData.requestsByServerHour) {
            wip.requestsByServerHour[key] = (wip.requestsByServerHour[key] || 0) + dayData.requestsByServerHour[key]
        }
    }

    // Aggregate total log entries
    wip.totals.logEntries = (wip.totals.logEntries || 0) + (dayData.logEntries || 0)
}

// For debugging, print lockViews aggregate as JSON
//console.log(JSON.stringify(lockViews, null, 2));


// --- SITE STATS OBJECT (final output) ---
let siteStatsFull = {}

// --- FUNCTIONS FOR BUILDING REPORTS ---

// 1. firstVisitByCountryHighlight
function firstVisitByCountryHighlight() {
    let jsonData = {}
    let columnsArray = []
    let dataArray = []

    jsonData.title = ''
    const columns = [
        ['country', 'Country', 'left'],
        ['firstVisit', 'First Visit', 'center'],
        ['visits', 'Visits', 'center']
    ]
    for (const col of columns) {
        columnsArray.push({id: col[0], name: col[1], align: col[2]})
    }
    jsonData.columns = columnsArray

    let countryCount = 0
    // Sort countries by firstVisit date (ascending) then alphabetically
    const sortedCountries = Object.keys(wip.firstVisit).sort((a, b) => {
        const da = dayjs(wip.firstVisit[a], 'YYYY-MM-DD')
        const db = dayjs(wip.firstVisit[b], 'YYYY-MM-DD')
        if (da.isSame(db)) {
            return a.localeCompare(b)
        }
        return da - db
    })
    for (const country of sortedCountries) {
        // If the first visit is within the last 7 days
        if (dayjs(wip.firstVisit[country], 'YYYY-MM-DD').isAfter(today.subtract(7, 'day'))) {
            dataArray.push({
                country: country,
                firstVisit: wip.firstVisit[country],
                visits: wip.visitsByCountry[country] || 0
            })
            countryCount++
        }
    }
    jsonData.countryCount = countryCount
    jsonData.data = dataArray
    siteStatsFull.firstVistsLastSevenDays = jsonData
}

// 2. raflByDate – Aggregates various RAFL metrics by date (last 28 days)
function raflByDate() {
    const daysToReportFiltered = 28
    let jsonData = {}
    let columnsArray = []
    let dataArray = []
    jsonData.title = ''
    const columns = [
        ['date', 'Date', 'left'],
        ['dateString', 'Date', 'left'],
        ['potViews', 'Pot Views', 'center'],
        ['potListViews', 'Pot List Views', 'center'],
        ['raflStats', 'Stats Views', 'center'],
        ['raflCharities', 'Charities Views', 'center'],
        ['raflEnterAbout', 'Enter/About Views', 'center'],
        ['raflForm', 'Entry Form Views', 'center']
    ]
    for (const col of columns) {
        columnsArray.push({id: col[0], name: col[1], align: col[2]})
    }
    jsonData.columns = columnsArray

    for (const date in wip.days) {
        const thisDate = dayjs(date, 'YYYY-MM-DD')
        if (thisDate.isBefore(endDate.subtract(daysToReportFiltered - 1, 'day'))) continue
        const weekend = (thisDate.day() === 0 || thisDate.day() === 6) ? 1 : 0
        const dataRow = {
            date: date,
            dateString: thisDate.format('MM/DD'),
            potViews: wip.days[date].totalRaflPotViews || 0,
            potListViews: (wip.days[date].pageViews && wip.days[date].pageViews['rafl']) || 0,
            raflStats: (wip.days[date].pageViews && wip.days[date].pageViews['raflStats']) || 0,
            raflCharities: (wip.days[date].pageViews && wip.days[date].pageViews['raflCharities']) || 0,
            raflEnterAbout: (wip.days[date].pageViews && wip.days[date].pageViews['raflEnterAbout']) || 0,
            raflForm: (wip.days[date].pageViews && wip.days[date].pageViews['raflForm']) || 0
        }
        dataArray.push(dataRow)
    }
    jsonData.data = dataArray
    siteStatsFull.rafl28days = jsonData
}

// 3. potViewsById – Aggregates RAFL pot views per ID and calculates percentages
function potViewsById() {
    let jsonPotViewsById = {}
    let columnsArray = []
    let dataArray = []
    jsonPotViewsById.description = 'RAFL Pot Views by ID'
    const columns = [
        ['id', 'Pot ID', 'left'],
        ['views', 'Pot Views', 'center'],
        ['percentViews', 'Percent Views', 'center']
    ]
    for (const col of columns) {
        columnsArray.push({id: col[0], name: col[1], align: col[2]})
    }
    jsonPotViewsById.columns = columnsArray

    for (const key in wip.raflPotViewsById) {
        if (key === '') continue
        const percentViews = ((wip.raflPotViewsById[key] / (wip.totals.totalPotViews + 0.0001)) * 100).toFixed(1)
        dataArray.push({
            id: key,
            views: wip.raflPotViewsById[key],
            percentViews: percentViews / 100 // stored as a fraction
        })
    }
    jsonPotViewsById.data = dataArray
    siteStatsFull.potViewsById = jsonPotViewsById
}

// 4. potViewsByCountry
function potViewsByCountry() {
    let jsonPotViewsByCountry = {}
    let dataArray = []
    for (const key in wip.raflPotViewsByCountry) {
        if (key === '') continue
        dataArray.push({country: key, views: wip.raflPotViewsByCountry[key]})
    }
    jsonPotViewsByCountry.data = dataArray
    siteStatsFull.potViewsByCountry = jsonPotViewsByCountry
}

// 5. trafficByDate – Daily traffic metrics (last 28 days)
function trafficByDate() {
    const daysToReportFiltered = 28
    let jsonData = {}
    let columnsArray = []
    let dataArray = []
    jsonData.title = ''
    const columns = [
        ['weekend', 'Weekend', 'hidden'],
        ['date', 'Date', 'left'],
        ['dateString', 'Date', 'left'],
        ['visitors', 'Visitors', 'center'],
        ['visits', 'Visits', 'center'],
        ['lockViews', 'Views', 'center']
    ]
    for (const col of columns) {
        columnsArray.push({id: col[0], name: col[1], align: col[2]})
    }
    jsonData.columns = columnsArray
    let totalVisitorsDate = 0, totalVisitsDate = 0, totalViewsDate = 0

    for (const date in wip.days) {
        totalVisitorsDate += wip.days[date].visitors || 0
        totalVisitsDate += wip.days[date].visits || 0
        totalViewsDate += wip.days[date].totalLockViews || 0
        const thisDate = dayjs(date, 'YYYY-MM-DD')
        if (thisDate.isBefore(endDate.subtract(daysToReportFiltered - 1, 'day'))) continue
        const weekend = (thisDate.day() === 0 || thisDate.day() === 6) ? 1 : 0
        dataArray.push({
            weekend: weekend,
            date: date,
            dateString: thisDate.format('MM/DD'),
            visitors: wip.days[date].visitors || 0,
            visits: wip.days[date].visits || 0,
            lockViews: wip.days[date].totalLockViews || 0
        })
    }
    jsonData.data = dataArray
    siteStatsFull.traffic28days = jsonData

    // Daily averages over the period
    const aveVisitors = Math.round(totalVisitorsDate / daysToReportFiltered)
    const aveVisits = Math.round(totalVisitsDate / daysToReportFiltered)
    const aveLockViews = Math.round(totalViewsDate / daysToReportFiltered)
    let jsonDailyAverages = {description: 'Daily Averages'}
    jsonDailyAverages.data = [
        {label: 'Visitors', value: aveVisitors},
        {label: 'Visits', value: aveVisits},
        {label: 'Lock Views', value: aveLockViews}
    ]
    siteStatsFull.dailyAverages = jsonDailyAverages

    // Totals since launch
    let jsonTotals = {description: 'Since Launch'}
    jsonTotals.data = [
        {label: 'Lock Views', value: wip.totals.totalLockViews},
        {label: 'Site Vists', value: wip.totals.visits},
        {label: 'Countries', value: Object.keys(wip.visitsByCountry).length}
    ]
    siteStatsFull.totals = jsonTotals
}

// 6. trafficByWeek
function trafficByWeek() {
    let jsonLockViewPoints = []
    for (const weekKey of Object.keys(wip.weeks).sort()) {
        // Skip partial weeks by comparing difference with endDate
        const diff = dayjs(endDate.format('YYYY-MM-DD')).diff(dayjs(weekKey, 'YYYY-MM-DD'), 'day')
        if (diff > 5) {
            jsonLockViewPoints.push({x: weekKey, y: wip.weeks[weekKey].totalLockViews || 0})
        }
    }
    jsonLockViewPoints
        .filter(item => dayjs(item.x, 'YYYY-MM-DD').isAfter( dayjs('2024-02-20') ))
        .sort((a, b) => dayjs(a.x, 'YYYY-MM-DD').valueOf() - dayjs(b.x, 'YYYY-MM-DD').valueOf())
    siteStatsFull.lockViews = [{id: 'Lock Views', data: jsonLockViewPoints}]
}

// 7. popularCountries – builds JSON data for popular countries, European countries, and US states
function popularCountries() {
    let countryAreas = []
    let europeanCountryAreas = []
    for (const key of Object.keys(wip.visitsByCountry).sort((a, b) => {
        // Descending order by visits
        return (wip.visitsByCountry[b] || 0) - (wip.visitsByCountry[a] || 0) || a.localeCompare(b)
    })) {
        if (key === 'Europe') continue
        countryAreas.push({area: key, visits: wip.visitsByCountry[key]})
        // If countryTZ mapping for this country indicates Europe
        if (countryTZ[key] && countryTZ[key][1] === 'Europe') {
            europeanCountryAreas.push({area: key, visits: wip.visitsByCountry[key]})
        }
    }
    let popularAreasJson = {}
    popularAreasJson.popularCountries = {description: 'Popular Countries', data: countryAreas}
    popularAreasJson.popularEuropeanCountries = {description: 'Popular European Countries', data: europeanCountryAreas}

    let stateAreas = []
    for (const key of Object.keys(wip.states).sort((a, b) => (wip.states[b] || 0) - (wip.states[a] || 0) || a.localeCompare(b))) {
        stateAreas.push({area: key, visits: wip.states[key]})
    }
    popularAreasJson.popularStates = {description: 'Popular US States', data: stateAreas}

    siteStatsFull.popularAreas = popularAreasJson
}

// 8. lockViewsByBelt – aggregates lock views by belt ranking
function lockViewsByBelt() {
    const beltRanks = {
        White: 1,
        Yellow: 2,
        Orange: 3,
        Green: 4,
        Blue: 5,
        Purple: 6,
        Brown: 7,
        Red: 8,
        Black: 9,
        Unranked: 10
    }
    let jsonLockViewsByBelt = {description: 'Lock Views By Belt'}
    let dataArray = []
    if (wip.lockViewsByBelt) {
        // Sort keys by defined beltRanks
        const sortedBelts = Object.keys(wip.lockViewsByBelt).sort((a, b) => (beltRanks[a] || 100) - (beltRanks[b] || 100))
        for (const belt of sortedBelts) {
            if (belt === '') continue
            const percentViews = ((wip.lockViewsByBelt[belt] / (wip.totals.totalLockViews || 1)) * 100).toFixed(1)
            dataArray.push({id: belt, label: belt, value: percentViews / 100})
        }
    }
    jsonLockViewsByBelt.data = dataArray
    siteStatsFull.lockViewsByBelt = jsonLockViewsByBelt
}

// 9. pageTracking – aggregates daily page tracking for selected pages (last 14 days)
function pageTracking() {
    const daysToReportFiltered = 14
    let jsonData = {}
    let columnsArray = []
    let dataArray = []
    const reportPages = ['glossary', 'leaderboard', 'stats', 'profile', 'editprofile', 'about', 'admin', 'dials', 'other']
    const pageList = {
        total: 'total',
        profile: 'profile',
        error: 'error',
        dials: 'dials',
        dial: 'dial',
        leaderboard: 'leaderboard',
        scorecard: 'scorecard',
        editprofile: 'edit profile',
        beltRequirements: 'belt requirements',
        compact: 'compact',
        dans: 'dans',
        glossary: 'glossary',
        projects: 'projects',
        stats: 'stats',
        about: 'about',
        viewprofileredirect: 'profile redirect',
        admin: 'admin',
        upgrades: 'upgrades',
        viewscorecardredirect: 'scorecard redirect',
        award: 'award',
        'scorecard-howto': 'howto',
        'scorecard-info': 'info',
        importPreview: 'import preview',
        potListViews: 'rafl pot List',
        raflCharities: 'rafl charities',
        raflEnterAbout: 'rafl enter',
        raflForm: 'rafl form',
        raflStats: 'rafl stats'
    }

    // First column for date
    columnsArray.push({id: 'date', name: 'Date', align: 'left'})
    // Determine additional pages from the data
    let pages = new Set()
    for (const date in wip.days) {
        const dateObj = dayjs(date, 'YYYY-MM-DD')
        if (dateObj.isBefore(endDate.subtract(daysToReportFiltered, 'day'))) continue
        if (wip.days[date].pageViews) {
            for (const page in wip.days[date].pageViews) {
                if (page && !pages.has(page)) {
                    pages.add(page)
                }
            }
        }
    }
    pages = Array.from(pages)
    for (const page of pages) {
        columnsArray.push({id: page, name: pageList[page] || page, align: 'center'})
    }
    jsonData.title = ''
    jsonData.columns = columnsArray

    let filteredTotals = {}
    for (const date in wip.days) {
        const dateObj = dayjs(date, 'YYYY-MM-DD')
        if (dateObj.isBefore(endDate.subtract(daysToReportFiltered, 'day'))) continue
        let pagesDayData = {date: dateObj.format('MM/DD/YY')}
        if (wip.days[date].pageViews) {
            for (const page in wip.days[date].pageViews) {
                pagesDayData[page] = wip.days[date].pageViews[page] || 0
                filteredTotals[page] = (filteredTotals[page] || 0) + (wip.days[date].pageViews[page] || 0)
            }
        }
        dataArray.push(pagesDayData)
    }
    // Add total row
    let pagesTotalData = {date: 'total'}
    for (const page of pages) {
        pagesTotalData[page] = filteredTotals[page] || 0
    }
    dataArray.push(pagesTotalData)
    jsonData.data = dataArray
    siteStatsFull.pageTracking = jsonData
}

// 10. platformBrowser – aggregates platform and browser data
function platformBrowser() {
    // Platforms
    const mainPlatforms = ['Android', 'Win10.0', 'iOS', 'Mac OS X', 'Linux']
    let platformData = []
    let otherPlatforms = 0
    for (const key of Object.keys(wip.platforms).sort((a, b) => (wip.platforms[b] || 0) - (wip.platforms[a] || 0))) {
        if (mainPlatforms.includes(key)) {
            platformData.push({id: key, label: key, value: wip.platforms[key]})
        } else {
            otherPlatforms += wip.platforms[key]
        }
    }
    platformData.push({id: 'Other', label: 'Other', value: otherPlatforms})

    // Browsers
    const mainBrowsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Samsung', 'Opera', 'Facebook']
    let browserData = []
    let otherBrowsers = 0
    for (const key of Object.keys(wip.browsers).sort((a, b) => (wip.browsers[b] || 0) - (wip.browsers[a] || 0))) {
        if (mainBrowsers.includes(key)) {
            browserData.push({id: key, label: key, value: wip.browsers[key]})
        } else {
            otherBrowsers += wip.browsers[key]
        }
    }
    browserData.push({id: 'Other', label: 'Other', value: otherBrowsers})

    siteStatsFull.trafficTotals = {platform: platformData, browser: browserData}
}

// 11. hourlyRequests – aggregates request counts by hour (using descriptive names)
function hourlyRequests() {
    const hourNames = [
        'midnight', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am',
        '7 am', '8 am', '9 am', '10 am', '11 am', 'noon', '1 pm', '2 pm',
        '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'
    ]
    let serverData = []
    let userData = []

    for (const hour in wip.requestsByLocalHour) {
        const hourNum = Number(hour)
        if (isNaN(hourNum) || hour === '') continue
        serverData.push({x: hourNames[hourNum], y: wip.requestsByServerHour[hour] || 0})
        userData.push({x: hourNames[hourNum], y: wip.requestsByLocalHour[hour] || 0})
    }
    serverData.sort((a, b) => hourNames.indexOf(a.x) - hourNames.indexOf(b.x))
    userData.sort((a, b) => hourNames.indexOf(a.x) - hourNames.indexOf(b.x))

    siteStatsFull.hourlyRequests = [
        {id: 'User Time', data: userData},
        {id: 'Server Time', data: serverData}
    ]
}

// 12. screenWidths – aggregates lock views by screen width
function screenWidths() {
    let jsonData = {}
    jsonData.columns = [
        {id: 'width', name: 'Screen Width', align: 'left'},
        {id: 'lockViews', name: 'Lock Views', align: 'center'}
    ]
    let dataArray = []
    for (const width of Object.keys(wip.lockViewsByWidth).sort((a, b) => (wip.lockViewsByWidth[b] || 0) - (wip.lockViewsByWidth[a] || 0))) {
        if (width) {
            dataArray.push({width: Number(width), lockViews: wip.lockViewsByWidth[width]})
        }
    }
    jsonData.data = dataArray
    jsonData.title = ''
    siteStatsFull.screenWidths = jsonData
}

// 13. outputSiteFullJson – write final JSON with metadata
function outputSiteFullJson() {
    const dt = dayjs().tz('America/Los_Angeles')
    siteStatsFull.metadata = {
        updatedDateTime: dt.format(),
        timezone: dt.format('z')
    }
    const json_text = JSON.stringify(siteStatsFull, null, 2)
    fs.writeFileSync(siteStatsFullJsonFile, json_text, 'utf8')
}

// --- EXECUTE REPORT BUILDING FUNCTIONS ---
firstVisitByCountryHighlight()
raflByDate()
potViewsById()
potViewsByCountry()
trafficByDate()
trafficByWeek()
popularCountries()
lockViewsByBelt()
pageTracking()
platformBrowser()
hourlyRequests()
screenWidths()
outputSiteFullJson()

// --- RUNTIME INFO ---
console.log(`Data Process Runtime: ${String(dayjs().diff(today, 'minute')).padStart(2, '0')}:${String(dayjs().diff(today, 'second')).padStart(2, '0')}.${String(dayjs().diff(today, 'millisecond')).substring(0,2)}`);

if (local) {
    exec('say \'done\'')
}
