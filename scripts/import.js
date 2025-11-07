import fs from 'fs'
import dayjs from 'dayjs'
import {parse} from 'csv-parse/sync'
import {
    mainSchema,
    mediaSchema,
    linkSchema,
    descriptionSchema,
    viewSchema,
    groupSchema,
    glossarySchema,
    dialsSchema,
    projectSchema,
    upgradeSchema,
    introCopySchema,
    platformBeltSchema,
    raflSchema,
    raflMediaSchema,
    raflCharitySchema
} from './importSchemas.js'
import {allBelts, beltSort} from '../src/data/belts.js'
import fetch from 'node-fetch'
import validate from './validate.js'
import entryName from '../src/entries/entryName.js'
import {saveLockStats} from './saveLockStats.js'

const importRaflData = true

// Helper to load and validate a file
const importValidate = async (tab, schema) => {
    console.log(`Importing ${tab}...`)
    const {GOOGLE_SHEET_ID: sheetId, RAFL_SHEET_ID: raflSheetId} = process.env
    if (!sheetId || !raflSheetId) {
        console.log('Config error! Set GOOGLE_SHEET_ID & RAFL_SHEET_ID env vars to run Import.')
        process.exit(1)
    }

    // Download file
    const safeTab = encodeURI(tab)

    const url = (!['RAFL', 'RAFL Media', 'RAFL Pot Contents', 'RAFL Charities'].includes(tab))
        ? `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
        : `https://docs.google.com/spreadsheets/d/${raflSheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
    const csvData = await (await fetch(url)).text()

    // Parse CSV into JSON
    const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    })

    // Validate data before merging in
    validate(data, schema)

    return data
}

// Load all 3 data files (LOL)
const mainData = await importValidate('App Data', mainSchema)
const mediaData = await importValidate('Media', mediaSchema)
const linkData = await importValidate('Links', linkSchema)
const descriptionData = await importValidate('Descriptions', descriptionSchema)
const viewData = await importValidate('Lock Views', viewSchema)
const groupData = await importValidate('Groups', groupSchema)
const glossaryData = await importValidate('Glossary', glossarySchema)
const dialsData = await importValidate('Dials', dialsSchema)
const dialsMediaData = await importValidate('Dials Media', mediaSchema)
const dialsLinkData = await importValidate('Dials Links', linkSchema)
const projectsData = await importValidate('Projects', projectSchema)
const upgradeData = await importValidate('Upgrades', upgradeSchema)
const introCopyData = await importValidate('Intro Copy', introCopySchema)
const platformBeltData = await importValidate('Platform Belt Counts', platformBeltSchema)

const raflData = importRaflData ? await importValidate('RAFL', raflSchema) : []
const raflMediaData = importRaflData ? await importValidate('RAFL Media', raflMediaSchema) : []
const raflCharityData = importRaflData ? await importValidate('RAFL Charities', raflCharitySchema) : []

// Load previous JSON for recently updated checks
const originalData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

// Transform fields into internal JSON format
console.log('Processing main data...')
const jsonData = mainData
    .map(datum => {
        const id = datum['Unique ID']
        const belt = datum.Belt
        const makes = splitCommaValues(datum.Make)
        const models = splitCommaValues(datum.Model)
        const makeModels = models.map((model, index) => ({
            make: makes[index],
            model: model
        }))
        const version = datum.Version
        const lockingMechanisms = splitCommaValues(datum['Locking Mechanisms'])
        const features = splitCommaValues(datum.Features)
        const notes = datum.Notes
        const searchKeywords = datum['Search Keywords']
        const modelNum = datum['Model Num']

        const value = {
            id,
            belt,
            makeModels,
            version,
            lockingMechanisms,
            features,
            notes,
            searchKeywords,
            modelNum
        }

        // Clean up empty values to reduce payload size
        Object.keys(value).forEach(key => {
            if (typeof value[key] === 'string' && value[key] === '') value[key] = undefined
            else if (Array.isArray(value[key]) && value[key].length === 0) value[key] = undefined
        })

        return value
    })
    .sort((a, b) => {
        // Sort by belt first, keeping all Black belt variations together
        const beltNumberA = allBelts.indexOf(a.belt.replace(/\s\d/g, ''))
        const beltNumberB = allBelts.indexOf(b.belt.replace(/\s\d/g, ''))

        if (beltNumberA === beltNumberB) {
            // If belt is equal, sort by make/model, keeping Any above others
            const fuzzyA = a.makeModels[0].make === 'Any'
                ? 'A' : a.makeModels
                    .map(({make, model}) => [make, model])
                    .flat()
                    .filter(a => a)
                    .join(',')
                    .toLowerCase()
            const fuzzyB = b.makeModels[0].make === 'Any'
                ? 'A' : b.makeModels
                    .map(({make, model}) => [make, model])
                    .flat()
                    .filter(a => a)
                    .join(',')
                    .toLowerCase()

            return fuzzyA < fuzzyB ? -1 : 1
        } else {
            return beltNumberA < beltNumberB ? -1 : 1
        }
    })

// Find any added or deleted entries
const historicalData = JSON.parse(fs.readFileSync('./src/data/historicalData.json', 'utf8'))
let changedEntries = 0
jsonData.forEach(entry => {
    const name = entryName(entry, 'short').trim()
    const previousEntry = originalData.find(e => e.id === entry.id)
    if (!previousEntry && !historicalData[entry.id]) {
        historicalData[entry.id] = {...entry, name, dateAdded: dayjs().toISOString()}
        changedEntries++
    } else if (historicalData[entry.id]) {
        delete historicalData[entry.id].dateDeleted
        historicalData[entry.id] = {...historicalData[entry.id], ...entry, name}
    }
    entry.dateAdded = historicalData[entry.id].dateAdded
})
originalData.forEach(entry => {
    const currentEntry = jsonData.find(e => e.id === entry.id)
    if (!currentEntry) {
        historicalData[entry.id] = {...historicalData[entry.id], dateDeleted: dayjs().toISOString()}
        changedEntries++
    }
})

// Save historical data & deleted entries
console.log('Writing historicalData.json')
console.log(`${changedEntries} additions or deletions found`)
fs.writeFileSync('./src/data/historicalData.json', JSON.stringify(historicalData, null, 2))

console.log('Writing deletedEntries.json')
const deletedEntries = Object.values(historicalData).filter(entry => entry.dateDeleted) || []
fs.writeFileSync('./src/data/deletedEntries.json', JSON.stringify(deletedEntries, null, 2))

// Add projects data
console.log('Processing project data...')
const projects = projectsData
    .map(item => {
        const id = item['Unique ID']
        const allowMultiple = item['Allow Multiple']
        const name = item.Name
        const tier = item.Tier
        const makeModels = [{make: '', model: item.Name}]
        const projectBelts = ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Dan Points 5', 'Dan Points 10', 'Dan Points 25', 'Dan Points 30']
        const projectTiers = ['T1', 'T2', 'T3', 'T4', 'T5', 'T10', 'T11', 'T12', 'T13']
        const belt = projectBelts[projectTiers.indexOf(item.Tier)]
        const project = {
            id,
            tier,
            name,
            belt,
            makeModels
        }
        if (allowMultiple === 'Yes' || allowMultiple === 'TRUE') {
            project.allowMultiple = true
        }
        return project
    })
    .sort((a, b) => a.name.localeCompare(b.name))

console.log('Writing projects.json')
fs.writeFileSync('./src/data/projects.json', JSON.stringify(projects, null, 2))

// Add upgrade data
console.log('Processing project data...')
const upgrades = upgradeData
    .reduce((acc, item) => {
        const id = item['Base ID']
        const upgrade1 = item['Upgrade ID 1'] ? item['Upgrade ID 1'].toString() : null
        const upgrade2 = item['Upgrade ID 2'] ? item['Upgrade ID 2'].toString() : null
        const upgrade3 = item['Upgrade ID 3'] ? item['Upgrade ID 3'].toString() : null
        const upgrade4 = item['Upgrade ID 4'] ? item['Upgrade ID 4'].toString() : null

        const upgradeArray = [upgrade1]
        if (upgrade2) {
            upgradeArray.push(upgrade2)
        }
        if (upgrade3) {
            upgradeArray.push(upgrade3)
        }
        if (upgrade4) {
            upgradeArray.push(upgrade4)
        }

        acc[id] = upgradeArray
        return acc
    }, {})

console.log('Writing upgrades.json')
fs.writeFileSync('./src/data/upgrades.json', JSON.stringify(upgrades, null, 2))

// Collect previous media for updated comparison

const previousMedia = originalData.reduce((acc, entry) => {
    if (entry.media) {
        entry.media.forEach(media => {
            acc.push(media)
        })
    }
    return acc
}, [])

// Add media data
mediaData
    .sort((a, b) => {
        return a['Unique ID'].localeCompare(b['Unique ID'])
            || a['Sequence ID'] - b['Sequence ID']
    })
    .forEach((item, index) => {
        const entry = jsonData.find(e => e.id === item['Unique ID'])
        const previousItem = previousMedia.find(m => m.fullUrl === item['Full URL'])
        if (!entry) return console.log('Entry not found!', historicalData[item['Unique ID']].name, item)
        if (!entry.media) entry.media = []
        let dateAdded
        if (previousItem) {
            dateAdded = previousItem.dateAdded
        } else {
            dateAdded = dayjs().toISOString()
        }

        const media = {
            title: item.Title,
            subtitle: item.Subtitle,
            label: item.Label || undefined,
            thumbnailUrl: item['Thumbnail URL'],
            fullUrl: item['Full URL'],
            sequenceId: index + 1,
            dateAdded
        }
        if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
        if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
        entry.media.push(media)
    })

// Add link data
console.log('Processing link data...')
linkData
    .sort((a, b) => {
        const one = a['Sequence ID']
        const two = b['Sequence ID']
        if (one === two) return 0
        else if (one > two) return 1
        else return -1
    })
    .forEach(item => {
        const entry = jsonData.find(e => e.id === item['Unique ID'])
        if (entry) {
            if (!entry.links) entry.links = []
            entry.links.push({
                title: item.Title,
                url: item.URL
            })
        } else {
            console.log('Entry not found!', historicalData[item['Unique ID']].name, item)
        }
    })

// Add description data
console.log('Processing description data...')
descriptionData
    .forEach(item => {
        const entry = jsonData.find(e => e.id === item['Unique ID'])
        if (!entry) return console.log('descriptionData Import; Entry not found:', item)
        entry.description = item['Description']
    })

// Add view data
console.log('Processing view data...')
viewData
    .forEach(item => {
        const entry = jsonData.find(e => e.id === item['Unique ID'])
        if (!entry) return console.log('viewData Import; Entry not found:', item)
        entry.views = +item['Count']
    })

// Lock Group data
console.log('Processing group data...')
groupData.forEach(group => {
    const relatedIds = splitCommaValues(group['Related IDs']).map(s => s.trim())
    const entries = relatedIds
        .map(id => jsonData.find(e => e.id === id))
        .filter(x => x)
        .sort((a, b) => beltSort(a.belt, b.belt))
    const sortedIds = entries.map(e => e.id)
    entries.forEach(entry => {
        entry.relatedIds = sortedIds.filter(rid => rid !== entry.id)
    })
})

// Recently updated data
console.log('Processing recenty updated data...')
jsonData
    .forEach(entry => {
        const {lastUpdated, ...oldEntry} = originalData.find(e => e.id === entry.id) || {}
        if (JSON.stringify(keyAttributes(entry)) !== JSON.stringify(keyAttributes(oldEntry))) {
            console.log(`Lock Entry updated ${entry.id}`)
            entry.lastUpdated = dayjs().toISOString()
        } else {
            entry.lastUpdated = lastUpdated
        }
    })

function keyAttributes(entry) {
    const {belt, makeModels, lockingMechanisms, media} = entry
    return {belt, makeModels, lockingMechanisms, mediaCount: media?.length}
}

// Write out to src location for usage
console.log('Writing data.json...')
fs.writeFileSync('./src/data/data.json', JSON.stringify(jsonData, null, 2))

// Glossary Data
console.log('Processing glossary data...')
const glossary = glossaryData
    .map((item, index) => {
        const term = item.Term
        const definition = item.Definition
        const hasMedia = item.Title && item.Subtitle && item['Thumbnail URL'] && item['Full URL']
        const media = hasMedia ? {
            title: item.Title,
            subtitle: item.Subtitle,
            thumbnailUrl: item['Thumbnail URL'],
            fullUrl: item['Full URL'],
            sequenceId: index + 1,
            label: item.Term
        } : undefined
        if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
        if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
        return {term, definition, media}
    })
    .sort((a, b) => a.term.localeCompare(b.term))

console.log('Writing glossary.json')
fs.writeFileSync('./src/data/glossary.json', JSON.stringify(glossary, null, 2))

// Dials Data
console.log('Processing Dials data...')
const dialsMainData = dialsData.map(datum => {
    if (!datum['Do Not Import']) return {
        id: datum['Unique ID'],
        make: datum.Make,
        model: datum.Model,
        group: datum['Group'],
        fence: datum['Fence'],
        wheels: datum.Wheels,
        digits: datum.Digits,
        notes: datum.Notes,
        tier: datum['Quest Tier'],
        features: splitCommaValues(datum.Features)
    }
}).filter(x => x)

// Dials Media data
console.log('Processing Dials Media data...')
dialsMediaData
    .sort((a, b) => {
        const one = a['Sequence ID']
        const two = b['Sequence ID']
        if (one === two) return 0
        else if (one > two) return 1
        else return -1
    })
    .forEach((item, index) => {
        const entry = dialsMainData.find(e => e?.id === item['Unique ID'])
        if (!entry) return console.log('Entry not found!', item)
        if (!entry.media) entry.media = []
        const media = {
            title: item.Title,
            subtitle: item.Subtitle,
            thumbnailUrl: item['Thumbnail URL'],
            fullUrl: item['Full URL'],
            sequenceId: index + 1
        }
        if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
        if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
        entry.media.push(media)
    })

// Dials link data
console.log('Processing Dials link data...')
dialsLinkData
    .sort((a, b) => {
        const one = a['Sequence ID']
        const two = b['Sequence ID']
        if (one === two) return 0
        else if (one > two) return 1
        else return -1
    })
    .forEach(item => {
        const entry = dialsMainData.find(e => e.id === item['Unique ID'])
        if (!entry.links) entry.links = []
        entry.links.push({
            title: item.Title,
            url: item.URL
        })
    })

// Intro Copy Data
console.log('Processing Intro Copy data...')
const introCopyJson = introCopyData.reduce((acc, item) => {
    acc[item.Page] = {
        title: item.Title,
        copy: item['Intro Copy'],
        link: item['Link Text'],
        destination: item['Link Destination']
    }
    return acc
}, {})
fs.writeFileSync('./src/data/introCopy.json', JSON.stringify(introCopyJson, null, 2))

// Platform Belt Count Data
console.log('Processing Platform Belt Count data...')
const platformBeltJson = platformBeltData.reduce((acc, item) => {
    acc.discord = acc.discord ? acc.discord : {}
    acc.reddit = acc.reddit ? acc.reddit : {}
    acc.discord[item.Belt] = parseInt(item.Discord)
    acc.reddit[item.Belt] = parseInt(item.Reddit)
    return acc
}, {})
fs.writeFileSync('./src/data/platformBeltCounts.json', JSON.stringify(platformBeltJson, null, 2))

// Recently updated data
console.log('Processing recenty updated data...')
const orginalDialsData = JSON.parse(fs.readFileSync('./src/data/safelocks.json', 'utf8'))
dialsMainData
    .forEach(entry => {
        const {lastUpdated, ...oldEntry} = orginalDialsData.find(e => e?.id === entry?.id) || {}
        if (JSON.stringify(entry) !== JSON.stringify(oldEntry)) {
            console.log(`Dial Entry updated ${entry?.id}`)
            entry.lastUpdated = dayjs().toISOString()
        } else {
            entry.lastUpdated = lastUpdated
        }
    })

fs.writeFileSync('./src/data/safelocks.json', JSON.stringify(dialsMainData, null, 2))

// Check that all Features are accounted for in Glossary
const lockFeatures = jsonData
    .map(({features = [], lockingMechanism = []}) => {
        return [...features, lockingMechanism].flat()
    })
    .flat()
const dialFeatures = dialsMainData
    .map(({features = []}) => features)
    .flat()

new Set(lockFeatures).forEach(term => {
    const item = glossary.find(entry => entry.term.toLowerCase() === term.toLowerCase())
    if (!item) console.log('Term not defined in Glossary: ', term)
})

new Set(dialFeatures).forEach(term => {
    const item = glossary.find(entry => entry.term.toLowerCase() === term.toLowerCase())
    if (!item) console.log('Safe locks term not defined in Glossary: ', term)
})

if (importRaflData) {
    // RAFL Data
    console.log('Processing RAFL data...')
    const raflMainData = raflData
        .filter(datum => datum['Year'] === '2025')
        .map(datum => ({
            id: datum['Unique ID'],
            year: +datum['Year'],
            potNumber: parseInt(datum['Pot Number']),
            title: datum['Title'],
            winnerCount: parseInt(datum['Winner Count']) || 1,
            displayName: datum['Display Name'],
            description: datum['Description'],
            potContents: datum['Pot Contents'],
            keywords: datum['Keywords'],
            contributedBy: splitCommaValues(datum['Contributed By']),
            tags: splitCommaValues(datum['Tags']),
            country: splitCommaValues(datum['Country']),
            shippingInfo: datum['Shipping Info Text'],
            splitShipping: datum['Split Shipping'] === 'TRUE' ? 'shippingNotSplit' : 'shippingSplit',
            splitShippingBoolean: datum['Split Shipping'] === 'TRUE',
            shippingType: datum['Shipping Type'],
            dateAdded: datum['Date Added']
        })).filter(x => x)

    // RAFL Media data
    console.log('Processing RAFL Media data...')
    raflMediaData
        .sort((a, b) => {
            const one = a['Sequence ID']
            const two = b['Sequence ID']
            if (one === two) return 0
            else if (one > two) return 1
            else return -1
        })
        .forEach((item, index) => {
            const entry = raflMainData.find(e => e?.id === item['Unique ID'])
            if (!entry) return console.log('Entry not found!', item)
            if (!entry.media) entry.media = []
            const media = {
                title: item.Title,
                subtitle: item.Subtitle,
                thumbnailUrl: item['Thumbnail URL'],
                fullUrl: item['Full URL'],
                sequenceId: index + 1
            }
            if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
            if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
            entry.media.push(media)
        })

    fs.writeFileSync('./src/data/rafl.json', JSON.stringify(raflMainData, null, 2))

    // RAFL Charity Data
    console.log('Processing RAFL Charity data...')
    const raflCharities = raflCharityData
        .map(datum => ({
            id: datum['Charity ID'],
            name: datum['Charity Name'],
            url: datum['URL'],
            tags: splitCommaValues(datum['Tags']),
            donations2024: parseInt(datum['Donations 2024'].replace(/[^0-9]/, '')) || 0,
            donations2025: parseInt(datum['Donations 2025'].replace(/[^0-9]/, '')) || 0,
            donationsPrevious: parseInt(datum['Donations 2025'].replace(/[^0-9]/, '')) || 0,
            disabled: datum['Disable'].length > 0,
        })).filter(x => x)

    fs.writeFileSync('./src/data/raflCharities.json', JSON.stringify(raflCharities, null, 2))
}

console.log('Saving lockStats.json...')
await saveLockStats().then()

console.log('Complete.')

function splitCommaValues(string) {
    if (!string) return []
    return string.replace(/\s+,|,\s+/g, ',')
        .split(',')
        .map(s => s.trim())
        .filter(x => x)
}
