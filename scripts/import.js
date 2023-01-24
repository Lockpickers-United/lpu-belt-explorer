import fs from 'fs'
import {parse} from 'csv-parse/sync'
import schema from './schema.js'

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
const cleaned = data.map(datum => {
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
    const regions = datum.Regions.split(',').filter(x => x)
    const notes = datum.notes

    const links = [...datum.Links.matchAll(/\[([^\]]+)]\(([^,]+)\)/g)]
        .map(([,text, url]) => ({text, url}))
    const media = [...datum.Media.matchAll(/\[([^\]]+)]\(([^,]+)\)/g)]
        .map(([,text, url]) => ({text, url}))

    return {
        belt,
        makeModels,
        version,
        lockingMechanisms,
        features,
        notes,
        regions,
        links,
        media,

    }
})

// Write out to src location for usage
fs.writeFileSync('./src/data/data.json', JSON.stringify(cleaned, null, 2))