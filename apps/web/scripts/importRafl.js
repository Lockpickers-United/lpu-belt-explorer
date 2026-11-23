import fs from 'fs'
import {parse} from 'csv-parse/sync'
import {
    raflSchema,
    raflMediaSchema,
    raflCharitySchema
} from './importSchemas.js'
import fetch from 'node-fetch'
import validate from './validate.js'
import dotenv from 'dotenv'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../src/data')
dotenv.config({path: path.resolve(__dirname, '../.env.keys'), quiet: true})

const importRaflData = true

// Helper to load and validate a file
const importValidate = async (tab, schema) => {
    console.log(`Importing ${tab}...`)
    const {GOOGLE_SHEET_ID: sheetId, RAFL_SHEET_ID: raflSheetId} = process.env
    if (!sheetId || !raflSheetId) {
        console.log('Config error! Set GOOGLE_SHEET_ID & RAFL_SHEET_ID env vars to run Import.')
        process.exit(1)
    }

    const safeTab = encodeURI(tab)

    const url = (!tab.includes('RAFL'))
        ? `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
        : `https://docs.google.com/spreadsheets/d/${raflSheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
    const csvData = await (await fetch(url)).text()

    const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    })

    validate(data, schema)

    return data
}

const raflData = importRaflData ? await importValidate('RAFL', raflSchema) : []
const raflMediaData = importRaflData ? await importValidate('RAFL Media', raflMediaSchema) : []
const raflData2026 = importRaflData ? await importValidate('RAFL 2026', raflSchema) : []
const raflMediaData2026 = importRaflData ? await importValidate('RAFL Media 2026', raflMediaSchema) : []
const raflCharityData = importRaflData ? await importValidate('RAFL Charities', raflCharitySchema) : []

if (importRaflData) {
    // RAFL Data
    console.log('Processing RAFL data...')
    const allRaflData = [...raflData, ...raflData2026]
    const raflMainData = allRaflData
        //.filter(datum => datum['Year'] === '2026')
        .map(datum => ({
            id: datum['Unique ID'],
            year: +datum['Year'],
            potNumber: parseInt(datum['Pot Number']),
            title: datum['Title'],
            winnerCount: parseInt(datum['Winner Count']) || 1,
            displayName: datum['Display Name'],
            description: datum['Description'],
            descriptionContinued: datum['Description Continued'],
            potContents: datum['Pot Contents'],
            category: splitCommaValues(datum['Category']),
            tags: splitCommaValues(datum['Tags']),
            keywords: datum['Keywords'],
            contributedBy: splitCommaValues(datum['Contributed By']),
            country: splitCommaValues(datum['Country']),
            shippingInfo: datum['Shipping Info Text'],
            splitShipping: datum['Split Shipping'] === 'TRUE' ? 'shippingNotSplit' : 'shippingSplit',
            splitShippingBoolean: datum['Split Shipping'] === 'TRUE',
            shippingType: datum['Shipping Type'],
            shipsToUS: datum['Ships To US'],
            dateAdded: datum['Date Added'],
            startDate: datum['Start Date'],
            endDate: datum['End Date'],
        })).filter(x => x)

    // RAFL Media data
    console.log('Processing RAFL Media data...')
    const allRaflMediaData = [...raflMediaData, ...raflMediaData2026]

    allRaflMediaData
        .sort((a, b) => {
            const one = a['Sequence ID']
            const two = b['Sequence ID']
            if (one === two) return 0
            else if (one > two) return 1
            else return -1
        })
        .forEach((item, index) => {
            const entry = raflMainData.find(e => e?.id === item['Unique ID'])
            if (!entry) return console.log('Entry not found!', item)
            if (!entry.media) entry.media = []
            const media = {
                title: item.Title,
                subtitle: item.Subtitle,
                thumbnailUrl: item['Thumbnail URL'],
                fullUrl: item['Full URL'],
                sequenceId: index + 1
            }
            if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
            if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
            entry.media.push(media)
        })

    fs.writeFileSync(path.resolve(dataDir, 'rafl.json'), JSON.stringify(raflMainData, null, 2))

    ///Users/nealbayless/LOCAL/GitHubLocal/lpu-belt-explorer/apps/web/src/data/rafl.json
    ///Users/nealbayless/LOCAL/GitHubLocal/lpu-belt-explorer/apps/web/src/data/rafl.json
    // RAFL Charity Data
    console.log('Processing RAFL Charity data...')
    const raflCharities = raflCharityData
        .map(datum => ({
            id: datum['Charity ID'],
            name: datum['Charity Name'],
            url: datum['URL'],
            tags: splitCommaValues(datum['Tags']),
            donations2024: parseInt(datum['Donations 2024'].replace(/[^0-9]/, '')) || 0,
            donations2025: parseInt(datum['Donations 2025'].replace(/[^0-9]/, '')) || 0,
            donationsPrevious: parseInt(datum['Donations 2025'].replace(/[^0-9]/, '')) || 0,
            disabled: datum['Disable'].length > 0
        })).filter(x => x)

    fs.writeFileSync(path.resolve(dataDir, 'raflCharities.json'), JSON.stringify(raflCharities, null, 2))
}

console.log('Complete.')

function splitCommaValues(string) {
    if (!string) return []
    return string.replace(/\s+,|,\s+/g, ',')
        .split(',')
        .map(s => s.trim())
        .filter(x => x)
}
