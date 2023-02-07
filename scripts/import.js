import fs from 'fs'
import {parse} from 'csv-parse/sync'
import schema from './schema.js'
import belts from '../src/data/belts.js'

const beltNumbers = Object.keys(belts)

// Parse CSV into JSON
const csvData = fs.readFileSync('./scripts/data.csv')
const data = parse(csvData, {
    columns: true,
    skip_empty_lines: true
})

// Validate data before merging in
const results = schema.validate(data)
if (results.error) {
    console.log('Parse error!', results.error.details)
    process.exit(1)
}

// Transform fields into internal JSON format
const cleaned = data
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

        const links = [...datum.Links.matchAll(/\[([^\]]+)]\(([^)]+)\)/g)]
            .map(([, text, url]) => ({text, url}))
        const media = [...datum.Media.matchAll(/\[([^\]]+)]\(([^)]+)\)/g)]
            .map(([, text, url]) => ({text, url}))
        const attribution = [...datum.Attribution.matchAll(/\[([^\]]+)]\(([^)]+)\)/g)]
            .map(([, text, url]) => ({text, url}))
        const id = datum['Unique ID']

        const value = {
            id,
            belt,
            makeModels,
            version,
            lockingMechanisms,
            features,
            notes,
            links,
            media,
            attribution
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
            const fuzzyB = b.makeModels[0].make === 'Any'
                ? 'A' : b.makeModels
                .map(({make, model}) => [make, model])
                .flat()
                .filter(a => a)
                .join(',')

            return fuzzyA < fuzzyB ? -1 : 1
        } else {
            return beltNumberA < beltNumberB ? -1 : 1
        }
    })

// Write out to src location for usage
fs.writeFileSync('./src/data/data.json', JSON.stringify(cleaned, null, 2))