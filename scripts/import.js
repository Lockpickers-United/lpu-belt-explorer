import fs from 'fs'
import {parse} from 'csv-parse/sync'
import {mainSchema, mediaSchema, linkSchema} from './schemas.js'
import belts from '../src/data/belts.js'

const beltNumbers = Object.keys(belts)

// Helper to load and validate a file
const importValidate = (filename, schema) => {
    // Parse CSV into JSON
    const csvData = fs.readFileSync(filename)
    const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true
    })

    // Validate data before merging in
    const results = schema.validate(data)
    if (results.error) {
        console.log('Parse error!', JSON.stringify(results.error.details, null, 2))
        process.exit(1)
    }

    return data
}

// Load all 3 data files
const mainData = importValidate('./scripts/data.csv', mainSchema)
const mediaData = importValidate('./scripts/media.csv', mediaSchema)
const linkData = importValidate('./scripts/link.csv', linkSchema)

// Transform fields into internal JSON format
const jsonData = mainData
    .map(datum => {
        const belt = datum.Belt.toLowerCase().replace(/\s/g, '')
        const makes = datum.Make.split(',').filter(x => x)
        const models = datum.Model.split(',').filter(x => x)
        const makeModels = models.map((model, index) => ({
            make: makes[index],
            model
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
        const beltNumberA = beltNumbers.indexOf(a.belt.replace(/\d/g, ''))
        const beltNumberB = beltNumbers.indexOf(b.belt.replace(/\d/g, ''))

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
        if (!entry) console.log('Entry not found!', item)
        if (!entry.media) entry.media = []
        entry.media.push({
            title: item.Title,
            subtitle: item.Subtitle,
            thumbnailUrl: item['Thumbnail URL'],
            fullUrl: item['Full URL']
        })
    })

// Add link data
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

// Write out to src location for usage
fs.writeFileSync('./src/data/data.json', JSON.stringify(jsonData, null, 2))