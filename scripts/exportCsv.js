import fs from 'fs'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

// Clean up format to something that works for CSV
const mainData = rawData.map(datum => ({
    belt: datum.belt,
    make: datum.makeModels[0].make,
    model: datum.makeModels[0].model,
    version: datum.version,
    lockingMechanisms: datum?.lockingMechanisms?.join(','),
    features: datum?.features?.join(','),
    notes: datum.notes,
    uniqueId: datum.id
}))

// const mediaData = rawData.map((datum, index) => ({
//
// })).flat()
//
// const linkData = rawData.map((datum, index) => ({
//
// })).flat()

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

makeCsv(mainData, './scripts/data.csv')
makeCsv(mediaData, './scripts/media.csv')
makeCsv(linkData, './scripts/link.csv')