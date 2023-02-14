import fs from 'fs'
import belts, {uniqueBelts} from '../src/data/belts.js'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

const initialVal = uniqueBelts.reduce((acc, val) => ({...acc, [val]: []}), [])
const groupedByBelt = rawData.reduce((acc, val) => {
    const belt = val.belt.replace(/\d/g, '')
    acc[belt].push(val)
    return acc
}, initialVal)

const markdown = uniqueBelts.map(belt => {
    const header = `### ${belts[belt].label} Belt\n\n`
    const entries = groupedByBelt[belt].map(entry => {
        const makeModels = entry.makeModels.map(({make, model}) => {
            return make && make !== model ? `${make} ${model}` : model
        }).join (' / ')
        const version = entry.version ? ` (${entry.version})` : ''
        return `- ${makeModels}${version}`
    }).join('\n')
    return header + entries
}).join('\n\n')

fs.writeFileSync('./scripts/belts.md', markdown)