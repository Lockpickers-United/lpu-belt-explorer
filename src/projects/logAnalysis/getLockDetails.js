'use strict'

import { URL } from 'url'
import fetch from 'node-fetch' // npm install node-fetch@2

// ----------------------
// GLOBAL DATA OBJECTS
// ----------------------
let lockDetails = {}       // Array-like data per lock ID
let lockDetailsNew = {}    // Detailed object per lock ID
let allSamelineNames = {}
let mediaDetails = {}
let lockMechanismDetails = {}

let uniqueImages = {}
let uniqueContributors = {}
let locksByBelt = {}
let totalLocks = 0
let beltedLocks = 0
let locksWithMedia = 0
let beltedLocksWithMedia = 0

let projectDetails = {}
let awardDetails = {}
let potDetails = {}

// Internal accumulators
let locksHash = {}         // Merged lock objects from data.json and dials.json
let allLocks = {}          // For tracking existence (like a counter)
let allSafelocks = {}
let allMedia = []          // Array of media entries

let potsHash = {}          // From RAFL JSON
let allPots = {}           // For tracking RAFL pot IDs

let projectsHash = {}      // From projects.json
let allProjects = {}
let awardsHash = {}        // From awards.json
let allAwards = {}

// ----------------------
// HELPER FUNCTIONS
// ----------------------
async function getJson(url) {
    try {
        const response = await fetch(url, { timeout: 15000 })
        let content = await response.text()
        // Remove leading // if present
        content = content.replace(/^\/\//, '')
        return JSON.parse(content)
    } catch (err) {
        console.error(`Error fetching ${url}: ${err}`)
        return null
    }
}

// getShortName replicates the Perl subroutine.
// It concatenates make and model information from the lock’s makeModels array.
function getShortName(lock) {
    const lockMakes = {}
    if (!lock.makeModels || !Array.isArray(lock.makeModels)) return ''
    for (const mm of lock.makeModels) {
        // If no make, use model as make and clear model
        if (!mm.make) {
            mm.make = mm.model
            mm.model = ''
        }
        if (!lockMakes[mm.make]) {
            lockMakes[mm.make] = []
        }
        lockMakes[mm.make].push(mm.model)
    }
    // Build a short name from each make and its models
    const parts = []
    for (const make of Object.keys(lockMakes).sort()) {
        const models = lockMakes[make].filter(m => m && m.trim().length > 0)
        let part = make
        if (models.length > 0) {
            part += ' ' + models.join(', ')
        }
        parts.push(part)
    }
    // Replace double quotes with single quotes
    return parts.join(' / ').replace(/"/g, "'")
}

// ----------------------
// MAIN INITIALIZATION FUNCTION
// ----------------------
async function initLockDetails() {
    // --- GET LOCKS DATA ---
    const locksUrl = 'https://lpubelts.com/data.json'
    const locksArray = await getJson(locksUrl)
    if (locksArray && Array.isArray(locksArray)) {
        for (const lock of locksArray) {
            const UniqueID = lock.id
            locksHash[UniqueID] = lock
            // Add a shortName property
            locksHash[UniqueID].shortName = getShortName(locksHash[UniqueID])
            allLocks[UniqueID] = true
        }
    }

    // --- GET RAFL DATA ---
    const raflUrl = 'https://dev.lpubelts.com/rafl.json'
    const potsArray = await getJson(raflUrl)
    if (potsArray && Array.isArray(potsArray)) {
        for (const pot of potsArray) {
            const UniqueID = pot.id
            potsHash[UniqueID] = pot
            // Use pot title as shortName
            potsHash[UniqueID].shortName = pot.title
            allPots[UniqueID] = true
        }
        // Populate potDetails from potsHash
        for (const potID of Object.keys(potsHash)) {
            const pot = potsHash[potID]
            potDetails[potID] = {
                potName: pot.title,
                fullName: pot.title,
                contributedBy: pot.contributedBy,
                description: pot.description,
                tags: pot.tags,
                country: pot.country,
                shippingInfo: pot.shippingInfo,
                splitShipping: pot.splitShipping,
                shippingType: pot.shippingType,
                year: pot.year,
                winner: pot.winner,
            }
        }
    }

    // --- GET SAFE LOCK DATA ---
    const safelocksUrl = 'https://lpubelts.com/dials.json'
    const safelocksArray = await getJson(safelocksUrl)
    if (safelocksArray && Array.isArray(safelocksArray)) {
        for (const safelock of safelocksArray) {
            const UniqueID = safelock.id
            // Merge safelock into locksHash (overwriting if necessary)
            locksHash[UniqueID] = safelock
            locksHash[UniqueID].shortName = getShortName(safelock)
            allSafelocks[UniqueID] = true
        }
    }

    // --- GET PROJECT DATA ---
    const projectsUrl = 'https://lpubelts.com/projects.json'
    const projectArray = await getJson(projectsUrl)
    if (projectArray && Array.isArray(projectArray)) {
        for (const project of projectArray) {
            const UniqueID = project.id
            projectsHash[UniqueID] = project
            projectsHash[UniqueID].shortName = project.name
            allProjects[UniqueID] = true
        }
        for (const projectID of Object.keys(projectsHash)) {
            const project = projectsHash[projectID]
            projectDetails[projectID] = {
                projectName: project.name,
                fullBelt: project.belt ? project.belt.charAt(0).toUpperCase() + project.belt.slice(1) : '',
                belt: project.belt,
                tier: project.tier,
                rank: project.tier ? project.tier.slice(-1) : '',
                fullName: project.name,
                makeModels: project.makeModels,
            }
        }
    }

    // --- GET AWARDS DATA ---
    const awardsUrl = 'https://lpubelts.com/awards.json'
    const awardsArray = await getJson(awardsUrl)
    if (awardsArray && Array.isArray(awardsArray)) {
        let absRank = 0
        for (const award of awardsArray) {
            const UniqueID = award.id
            awardsHash[UniqueID] = award
            awardsHash[UniqueID].shortName = award.name
            awardsHash[UniqueID].absRank = absRank
            absRank++
            allAwards[UniqueID] = true
            if (!awardDetails.awardList) {
                awardDetails.awardList = []
            }
            awardDetails.awardList.push(UniqueID)
        }
        for (const awardID of Object.keys(awardsHash)) {
            const award = awardsHash[awardID]
            awardDetails[awardID] = {
                awardName: award.name,
                fullBelt: award.belt ? award.belt.charAt(0).toUpperCase() + award.belt.slice(1) : '',
                belt: award.belt,
                awardType: award.awardType,
                rank: award.rank,
                fullName: (award.makeModels && award.makeModels[0] && award.makeModels[0].model) || '',
                makeModels: award.makeModels,
                absRank: award.absRank,
            }
        }
    }

    // --- PROCESS ALL LOCKS ---
    for (const lockID of Object.keys(locksHash)) {
        const lock = locksHash[lockID]
        const UniqueID = lock.id
        //const lastUpdated = lock.lastUpdated
        let fullBelt = lock.belt ? lock.belt.charAt(0).toUpperCase() + lock.belt.slice(1) : ''
        let belt = lock.belt ? lock.belt.charAt(0).toUpperCase() + lock.belt.slice(1) : 'Unranked'
        let rank = undefined
        if (/Black \d/.test(belt)) {
            const parts = belt.split(' ')
            belt = parts[0]
            rank = parts[1]
        }
        // Prepare arrays for names and brands
        let samelineNames = []
        let lockBrands = []
        if (lock.makeModels && Array.isArray(lock.makeModels)) {
            for (const mm of lock.makeModels) {
                if (!mm.make) {
                    mm.make = mm.model
                    mm.model = ''
                }
                const lockBrand = mm.make
                if (!lockBrands.includes(lockBrand)) {
                    lockBrands.push(lockBrand)
                }
                let sameline = [mm.make, mm.model].filter(Boolean).join(' ')
                samelineNames.push(sameline)
                const samelineId = `${lockID}-${samelineNames.length}`
                allSamelineNames[samelineId] = sameline
            }
        }
        // Prepare a lock name (replace double quotes with single quotes)
        let lockName = lock.shortName ? lock.shortName.replace(/"/g, "'") : ''
        let version = lock.version
        let lockFullName = lockName
        if (version) {
            lockFullName = `${lockFullName} (${version})`
        }
        allSamelineNames[lockID] = lockName
        const lockViewCount = lock.views || 0
        const lockMedia = lock.media
        let mediaCount = lockMedia && Array.isArray(lockMedia) ? lockMedia.length : undefined
        if (lockMedia && Array.isArray(lockMedia)) {
            locksWithMedia++
            for (const mediaEntry of lockMedia) {
                allMedia.push(mediaEntry)
            }
        }
        if (lock.lockingMechanisms && Array.isArray(lock.lockingMechanisms)) {
            if (lock.lockingMechanisms.length > 1) {
                lockMechanismDetails[UniqueID] = 'Multiple'
            } else {
                lockMechanismDetails[UniqueID] = lock.lockingMechanisms[0]
            }
        }
        if (belt !== 'Unranked') {
            beltedLocks++
            if (lockMedia) {
                beltedLocksWithMedia++
            }
        }
        totalLocks++
        locksByBelt[belt] = (locksByBelt[belt] || 0) + 1
        // Save into lockDetails (as an array similar to the Perl version)
        lockDetails[UniqueID] = [
            lockName,
            version,
            belt,
            rank,
            mediaCount,
            lockViewCount,
            lockBrands[0] || '',
            lockFullName,
            lockBrands,
        ]
        // Save detailed data in lockDetailsNew
        lockDetailsNew[UniqueID] = {
            lockName,
            version,
            fullBelt,
            belt,
            rank,
            mediaCount,
            lockViewCount,
            lockBrands,
            lockFullName,
            samelineNames,
        }
    }

    // --- GET GLOSSARY DATA ---
    const glossaryUrl = 'https://lpubelts.com/glossary.json'
    const glossaryArray = await getJson(glossaryUrl)
    if (glossaryArray && Array.isArray(glossaryArray)) {
        for (const term of glossaryArray) {
            if (term.media) {
                allMedia.push(term.media)
            }
        }
    }

    // --- PROCESS MEDIA DETAILS ---
    for (const mediaEntry of allMedia) {
        const media = mediaEntry.fullUrl
        if (mediaDetails[media]) continue
        const thumbnail = mediaEntry.thumbnailUrl
        let mediaID = undefined, galleryID = undefined
        try {
            const parsedUrl = new URL(media)
            const host = parsedUrl.hostname
            if (host === 'www.flickr.com') {
                const flickrMatch = media.match(/\/(\d{11})\//)
                if (flickrMatch) {
                    mediaID = flickrMatch[1]
                }
                const galleryMatch = media.match(/album-(\d*)/)
                if (galleryMatch) {
                    galleryID = galleryMatch[1]
                }
            } else if (host === 'www.lockwiki.com' || host === 'lockwiki.com') {
                const m = media.match(/.*File:(.*)$/)
                if (m) mediaID = m[1]
            } else if (host === 'www.catalocks.eu') {
                const m = media.match(/photos\/(.*)\/(.*)$/)
                if (m) {
                    mediaID = m[1]
                    galleryID = m[2]
                }
            } else if (host === 'www.youtube.com') {
                mediaID = parsedUrl.searchParams.get('v')
                galleryID = parsedUrl.searchParams.get('list')
                if (media.includes('shorts') && !mediaID) {
                    const m = media.match(/shorts\/(.*)$/)
                    if (m) mediaID = m[1]
                }
            } else if (host === 'wiki.koksa.org') {
                const m = media.match(/Datei:(.*)$/)
                if (m) mediaID = m[1]
            } else if (host === 'qikom.free.fr') {
                const m = media.match(/qikom\.free\.fr\/(.*)$/)
                if (m) mediaID = m[1]
            } else {
                console.log(`Unknown media host: ${host}  full url: ${media}  thumbnail: ${thumbnail}`)
            }
        } catch (err) {
            console.error('Error parsing media URL:', media, err)
        }
        const contributor = mediaEntry.title
        const details = { mediaID, galleryID, thumbnail, contributor }
        mediaDetails[media] = details
        uniqueImages[media] = details
        uniqueContributors[contributor] = (uniqueContributors[contributor] || 0) + 1
    }
}

// Immediately initialize when this module is loaded.
const initPromise = initLockDetails()

// ----------------------
// EXPORT FUNCTIONS
// ----------------------
async function lockDetailsPM() {
    await initPromise
    return lockDetails
}
async function lockDetailsNewPM() {
    await initPromise
    return lockDetailsNew
}
async function allSamelineNamesPM() {
    await initPromise
    return allSamelineNames
}
async function mediaDetailsPM() {
    await initPromise
    return mediaDetails
}
async function uniqueImagesPM() {
    await initPromise
    return uniqueImages
}
async function uniqueContributorsPM() {
    await initPromise
    return uniqueContributors
}
async function locksByBeltPM() {
    await initPromise
    return locksByBelt
}
async function totalLocksPM() {
    await initPromise
    return totalLocks
}
async function beltedLocksPM() {
    await initPromise
    return beltedLocks
}
async function locksWithMediaPM() {
    await initPromise
    return locksWithMedia
}
async function beltedLocksWithMediaPM() {
    await initPromise
    return beltedLocksWithMedia
}
async function lockMechanismDetailsPM() {
    await initPromise
    return lockMechanismDetails
}
async function projectDetailsPM() {
    await initPromise
    return projectDetails
}
async function awardDetailsPM() {
    await initPromise
    return awardDetails
}
async function potDetailsPM() {
    await initPromise
    return potDetails
}

export {
    lockDetailsPM,
    lockDetailsNewPM,
    allSamelineNamesPM,
    mediaDetailsPM,
    uniqueImagesPM,
    uniqueContributorsPM,
    locksByBeltPM,
    totalLocksPM,
    beltedLocksPM,
    locksWithMediaPM,
    beltedLocksWithMediaPM,
    lockMechanismDetailsPM,
    projectDetailsPM,
    awardDetailsPM,
    potDetailsPM,
    // Also export initPromise in case the caller wants to wait for initialization.
    initPromise,
}
