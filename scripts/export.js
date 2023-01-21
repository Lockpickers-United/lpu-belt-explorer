const fs = require('fs')
const data = require('../src/data/data.json')

// Clean up format to something that works for CSV
const formatted = data.map(datum => ({
    belt: datum.belt,
    make: datum.makeModels[0].make,
    model: datum.makeModels[0].model,
    version: datum.version,
    lockingMechanisms: datum.lockingMechanisms.join(','),
    features: datum.features.join(','),
    notes: datum.notes,
    regions: datum.regions.join(','),
    links: datum.links.map(link => `[${link.text}](${link.url})`).join(','),
    media: datum.media?.map(media => `[${media.text}](${media.url})`).join(',')
}))

const headers = Object.keys(formatted[0])
const headerData = headers.join(',')
const fileData = formatted.map(datum => {
    return headers
        .map(header => datum[header])
        .map(value => {
            const newValue = `${value ?? ''}`.replace(/"/g, '""')
            return /(\s|,|")/.test(newValue) ? `"${newValue}"` : newValue
        })
        .join(',')
}).join('\n')
const fullFile = `${headerData}\n${fileData}`

fs.writeFileSync('./data.csv', fullFile)
