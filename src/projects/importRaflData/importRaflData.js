import fs from 'fs'
import {parse} from 'csv-parse/sync'
import fetch from 'node-fetch'
import {
    raflSchema,
    raflCharitySchema,
    raflMediaSchema,
} from './importSchemas.js'
import validate from './importValidate.js'

import {sheetIds} from '../../../keys/raflSheetIds.js'
const {raflSheetId} = sheetIds

// 15ebKk_otKTKFT0pbQuigY_ygMYMqbJTriS17B6MoUrk
// https://docs.google.com/spreadsheets/d/15ebKk_otKTKFT0pbQuigY_ygMYMqbJTriS17B6MoUrk/gviz/tq?tqx=out:csv&sheet=&headers=1

export default async function importRaflData(req, _res) {
    let errors = []
    const log = req?.log ?? console

    try {
        // Helper to load and validate a file
        const importValidate = async (tab, schema) => {

            if (!raflSheetId) {
                console.log('Config error! Set RAFL_SHEET_ID var to run Import.')
                process.exit(1)
            }

            const safeTab = encodeURI(tab)
            const url = `https://docs.google.com/spreadsheets/d/${raflSheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`

            log.info(url)
            log.info(safeTab)

            const csvData = await (await fetch(url)).text()

            // Parse CSV into JSON
            const data = parse(csvData, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            })

            // Validate data before merging in
            const error = validate(data, schema)
            if (error) errors.push(error)

            return data
        }

        const raflData = await importValidate('RAFL', raflSchema)
        const raflMediaData = await importValidate('RAFL Media', raflMediaSchema)
        const raflCharityData = await importValidate('RAFL Charities', raflCharitySchema)

        // RAFL Data
        //console.log('Processing RAFL data...')
        const raflMainData = raflData
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
                keywords: datum['Keywords'],
                contributedBy: splitCommaValues(datum['Contributed By']),
                tags: splitCommaValues(datum['Tags']),
                country: splitCommaValues(datum['Country']),
                shippingInfo: datum['Shipping Info Text'],
                splitShipping: datum['Split Shipping'] === 'TRUE' ? 'shippingNotSplit' : 'shippingSplit',
                splitShippingBoolean: datum['Split Shipping'] === 'TRUE',
                shippingType: datum['Shipping Type'],
                shipsToUS: datum['Ships To US'],
                dateAdded: datum['Date Added']
            })).filter(x => x)

        // RAFL Media data
        //console.log('Processing RAFL Media data...')
        raflMediaData
            .sort((a, b) => {
                const one = a['Sequence ID']
                const two = b['Sequence ID']
                if (one === two) return 0
                else if (one > two) return 1
                else return -1
            })
            .forEach(item => {
                const entry = raflMainData.find(e => e?.id === item['Unique ID'])
                if (!entry) {
                    errors.push({'Entry not found processing media': item})
                    return console.log('Entry not found!', item)
                }
                if (!entry.media) entry.media = []
                const media = {
                    title: item.Title,
                    subtitle: item.Subtitle,
                    thumbnailUrl: item['Thumbnail URL'],
                    fullUrl: item['Full URL']
                }
                if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
                if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
                entry.media.push(media)
            })

        // RAFL Charity Data
        //console.log('Processing RAFL data...')
        const raflCharities = raflCharityData.map(datum => ({
            id: datum['Unique ID'],
            name: datum['Charity Name'],
            url: datum['URL'],
            donations2024: parseInt(datum['Donations 2024'].replace(/[^0-9]/, '')) || 0
        })).filter(x => x)

        const version = {version: new Date()}

        const serverPath = process.env.LOGNAME === 'dh_m5s5pf'
            ? '/home/dh_m5s5pf/explore.lpubelts.com/public/data'
            : './'

        fs.writeFileSync(`${serverPath}/raflPreviewPots.json`, JSON.stringify(raflMainData, null, 2))
        fs.writeFileSync(`${serverPath}/raflPreviewCharities.json`, JSON.stringify(raflCharities, null, 2))
        fs.writeFileSync(`${serverPath}/raflPreviewVersion.json`, JSON.stringify(version, null, 2))

    } catch (err) {
        console.log('err', err)
        errors.push(err)
    }

    return errors.length > 0
        ? {status: 'Errors', errors: errors}
        : {status: 'All Good!'}

}

importRaflData().then()

//console.log('Complete.', {raflData: raflMainData, raflCharities: raflCharities})

function splitCommaValues(string) {
    if (!string) return []
    return string.replace(/\s+,|,\s+/g, ',').split(',').filter(x => x)
}
