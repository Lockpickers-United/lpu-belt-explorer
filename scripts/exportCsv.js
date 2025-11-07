import fs from 'fs'
import validate from './validate.js'
import {mainSchema, mediaSchema, linkSchema} from './importSchemas.js'
import {uniqueBelts} from '../src/data/belts.js'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

const initialValue = uniqueBelts.reduce((acc, belt) => {
    acc[belt] = [`${belt} Belt`]
    return acc
}, {})
const entriesByBelt = rawData.reduce((acc, entry) => {
    const belt = entry.belt.replace(/\s\d/g, '')
    if (acc[belt]) {
        const makeModels = entry.makeModels.map(({make, model}) => {
            return make && make !== model ? `${make} ${model}` : model
        }).join(' / ')
        const version = entry.version ? ` (${entry.version})` : ''
        acc[belt].push(`${makeModels}${version}`)
    }
    return acc
}, initialValue)
const largestColumn = Object.keys(entriesByBelt).reduce((acc, key) => Math.max(acc, entriesByBelt[key].length), 0)
const columnView = [...Array(largestColumn)]
    .map((_, index) => {
        return uniqueBelts.reduce((acc, key) => {
            acc[key] = entriesByBelt[key][index] || ''
            return acc
        }, {})
    })

const mainData = rawData.map(datum => ({
    belt: datum.belt,
    make: datum.makeModels.map(e => e.make).join(','),
    model: datum.makeModels.map(e => e.model).join(','),
    version: datum.version,
    lockingMechanisms: datum?.lockingMechanisms?.join(','),
    features: datum?.features?.join(','),
    notes: datum.notes,
    uniqueId: datum.id
}))

const mediaData = rawData.map(datum => {
    return datum.media?.map((m, index) => ({
        uniqueId: datum.id,
        sequenceId: index + 1,
        title: m.text,
        subtitle: datum.attribution?.[index]?.text,
        thumbnailUrl: m.url,
        fullUrl: datum.attribution?.[index]?.url
    }))
}).flat().filter(x => x)

const linkData = rawData.map(datum => {
    return datum.links?.map((l, index) => ({
        uniqueId: datum.id,
        sequenceId: index + 1,
        title: l.text,
        url: l.url
    }))
}).flat().filter(x => x)

const makeCsv = (data, filename) => {
    const headers = Object.keys(data[0])
    const fileData = data.map(datum => {
        return headers
            .map(header => datum[header])
            .map(value => {
                const newValue = `${value ?? ''}`.replace(/"/g, '""')
                return /(\s|,|")/.test(newValue) ? `"${newValue}"` : newValue
            })
            .join(',')
    }).join('\n')

    fs.writeFileSync(filename, fileData)
}

validate(mainData, mainSchema)
validate(mediaData, mediaSchema)
validate(linkData, linkSchema)

makeCsv(columnView, './dist/columnView.csv', true)
makeCsv(mainData, './dist/data.csv')
makeCsv(mediaData, './dist/media.csv')
makeCsv(linkData, './dist/link.csv')
