import fs from 'fs'
import validate from './validate.js'
import {mainSchema, mediaSchema, linkSchema} from './schemas.js'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

const belts = rawData.map(datum => ({
    uniqueId: datum.id,
    belt: datum.belt,
    lock: datum.makeModels.map(({make, model}) => {
        return make && make !== model ? `${make} ${model}` : model
    }).join (' / ')
}))

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

makeCsv(belts, './dist/belts.csv')
makeCsv(mainData, './dist/data.csv')
makeCsv(mediaData, './dist/media.csv')
makeCsv(linkData, './dist/link.csv')