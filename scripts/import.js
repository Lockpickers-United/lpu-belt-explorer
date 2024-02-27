import fs from 'fs'
import dayjs from 'dayjs'
import {parse} from 'csv-parse/sync'
import {
    mainSchema,
    mediaSchema,
    linkSchema,
    viewSchema,
    groupSchema,
    glossarySchema,
    dialsSchema
} from './schemas.js'
import {allBelts, beltSort} from '../src/data/belts.js'
import fetch from 'node-fetch'
import validate from './validate.js'

// Helper to load and validate a file
const importValidate = async (tab, schema) => {
    console.log(`Importing ${tab}...`)
    const {GOOGLE_SHEET_ID: sheetId} = process.env
    if (!sheetId) {
        console.log('Config error! Set GOOGLE_SHEET_ID env var to run Import.')
        process.exit(1)
    }

    // Download file
    const safeTab = encodeURI(tab)
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
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

// Load all 3 data files
const mainData = await importValidate('App Data', mainSchema)
const mediaData = await importValidate('Media', mediaSchema)
const linkData = await importValidate('Links', linkSchema)
const viewData = await importValidate('Lock Views', viewSchema)
const groupData = await importValidate('Groups', groupSchema)
const glossaryData = await importValidate('Glossary', glossarySchema)
const dialsData = await importValidate('Dials', dialsSchema)
const dialsMediaData = await importValidate('Dials Media', mediaSchema)
const dialsLinkData = await importValidate('Dials Links', linkSchema)

// Transform fields into internal JSON format
console.log('Processing main data...')
const jsonData = mainData
    .map(datum => {
        const belt = datum.Belt
        const makes = datum.Make.split(',').filter(x => x)
        const models = datum.Model.split(',').filter(x => x)
        const makeModels = models.map((model, index) => ({
            make: makes[index],
            model: model
        }))
        const version = datum.Version
        const lockingMechanisms = datum['Locking Mechanisms'].split(',').filter(x => x)
        const features = datum.Features.split(',').filter(x => x)
        const notes = datum.Notes
        const id = datum['Unique ID']

        const value = {
            id,
            belt,
            makeModels,
            version,
            lockingMechanisms,
            features,
            notes
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

// Add media data
mediaData
    .sort((a, b) => {
        const one = a['Sequence ID']
        const two = b['Sequence ID']
        if (one === two) return 0
        else if (one > two) return 1
        else return -1
    })
    .forEach(item => {
        const entry = jsonData.find(e => e.id === item['Unique ID'])
        if (!entry) return console.log('Entry not found!', item)
        if (!entry.media) entry.media = []
        const media = {
            title: item.Title,
            subtitle: item.Subtitle,
            thumbnailUrl: item['Thumbnail URL'],
            fullUrl: item['Full URL']
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
        if (!entry.links) entry.links = []
        entry.links.push({
            title: item.Title,
            url: item.URL
        })
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
    const relatedIds = group['Related IDs'].split(',').map(s => s.trim())
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
const originalData = JSON.parse(fs.readFileSync('./src/data/data.json'))
jsonData
    .forEach(entry => {
        const {lastUpdated, views: oldViews, ...oldEntry} = originalData.find(e => e.id === entry.id) || {}
        const {views: newViews, ...newEntry} = entry
        if (JSON.stringify(newEntry) !== JSON.stringify(oldEntry)) {
            console.log(`Lock Entry updated ${newEntry.id}`)
            entry.lastUpdated = dayjs().toISOString()
        } else {
            entry.lastUpdated = lastUpdated
        }
    })

// Write out to src location for usage
console.log('Writing data.json...')
fs.writeFileSync('./src/data/data.json', JSON.stringify(jsonData, null, 2))

// Glossary Data
console.log('Processing glossary data...')
const glossary = glossaryData
    .map(item => {
        const term = item.Term
        const definition = item.Definition
        const hasMedia = item.Title && item.Subtitle && item['Thumbnail URL'] && item['Full URL']
        const media = hasMedia ? {
            title: item.Title,
            subtitle: item.Subtitle,
            thumbnailUrl: item['Thumbnail URL'],
            fullUrl: item['Full URL']
        } : undefined
        if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
        if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
        return {term, definition, media}
    })
    .sort((a, b) => a.term.localeCompare(b.term))

console.log('Writing glossary.json')
fs.writeFileSync('./src/data/glossary.json', JSON.stringify(glossary, null, 2))

// Check that all Features are accounted for in Glossary
new Set(jsonData
    .map(({features = [], lockingMechanism = []}) => {
        return [...features, lockingMechanism].flat()
    })
    .flat())
    .forEach(term => {
        const item = glossary.find(entry => entry.term.toLowerCase() === term.toLowerCase())
        if (!item) console.log('Term not defined in Glossary: ', term)
    })

// Dials Data
console.log('Processing Dials data...')
const dialsMainData = dialsData.map(datum => {
    return {
        id: datum['Unique ID'],
        make: datum.Make,
        model: datum.Model,
        group: datum.Group,
        fence: datum.Fence,
        wheels: datum.Wheels,
        digits: datum.Digits,
        features: datum.Features ? datum.Features.split(',').filter(x => x) : []
    }
})

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
    .forEach(item => {
        const entry = dialsMainData.find(e => e.id === item['Unique ID'])
        if (!entry) return console.log('Entry not found!', item)
        if (!entry.media) entry.media = []
        const media = {
            title: item.Title,
            subtitle: item.Subtitle,
            thumbnailUrl: item['Thumbnail URL'],
            fullUrl: item['Full URL']
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

// Recently updated data
console.log('Processing recenty updated data...')
const orginalDialsData = JSON.parse(fs.readFileSync('./src/data/dials.json'))
dialsMainData
    .forEach(entry => {
        const {lastUpdated, ...oldEntry} = orginalDialsData.find(e => e.id === entry.id) || {}
        if (JSON.stringify(entry) !== JSON.stringify(oldEntry)) {
            console.log(`Dial Entry updated ${entry.id}`)
            entry.lastUpdated = dayjs().toISOString()
        } else {
            entry.lastUpdated = lastUpdated
        }
    })

fs.writeFileSync('./src/data/dials.json', JSON.stringify(dialsMainData, null, 2))

console.log('Complete.')
