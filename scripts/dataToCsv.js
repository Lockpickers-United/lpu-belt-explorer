import data from '../src/data.js'
import fs from 'fs'

const headers = [
    'belt',
    'make',
    'model',
    'type',
    'notes',
    'tags',
    // TODO 'links',
    'regions'
]

const headerData = headers.join(',')
const fileData = data.map(datum => {
    return headers
        .map(header => {
            const value = datum[header]
            if (Array.isArray(value))
                return value.join('|')
            else
                return value
        })
        .map(value => {
            const newValue = `${value ?? ''}`.replace(/"/g, '""')
            return /(\s|,|")/.test(newValue) ? `"${newValue}"` : newValue
        })
        .join(',')
}).join('\n')
const fullFile = `${headerData}\n${fileData}`

fs.writeFileSync('./data.csv', fullFile)
