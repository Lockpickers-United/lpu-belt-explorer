import fs from 'fs'
import {parse} from 'csv-parse/sync'
import fetch from 'node-fetch'
import {
    raflSchema,
    raflCharitySchema,
    raflPotStatsSchema,
    raflMediaSchema,
    raflCharityStatsSchema,
    raflSummaryStatsSchema
} from './src/schemas.js'
import validate from './src/validate.js'

import {sheetIds} from '../../keys/importRaflSheetIds.js'
const {raflSheetId, raflStatsId} = sheetIds
export default async function importRaflData() {
    let errors = []

    try {

        // Helper to load and validate a file
        const importValidate = async (tab, schema) => {

            if (!raflStatsId || !raflSheetId) {
                console.log('Config error! Set RAFL_SHEET_ID & RAFL_STATS_ID env vars to run Import.')
                process.exit(1)
            }

            const safeTab = encodeURI(tab)
            const url = (['RAFL', 'RAFL Media', 'RAFL Pot Contents', 'RAFL Charities'].includes(tab))
                ? `https://docs.google.com/spreadsheets/d/${raflSheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
                : `https://docs.google.com/spreadsheets/d/${raflStatsId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
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

        const raflPotStats = await importValidate('RAFL Pot Stats', raflPotStatsSchema)
        const raflCharityStats = await importValidate('RAFL Charity Stats', raflCharityStatsSchema)
        const raflSummaryStats = await importValidate('RAFL Summary Stats', raflSummaryStatsSchema)

        // RAFL Data
        //console.log('Processing RAFL data...')
        const raflMainData = raflData
            .map(datum => ({
                id: datum['Unique ID'],
                year: +datum['Year'],
                potNumber: datum['Pot Number'],
                formId: datum['Form ID'],
                title: datum['Title'],
                description: datum['Description'],
                potContents: datum['Pot Contents'],
                contributedBy: splitCommaValues(datum['Contributed By']),
                tags: splitCommaValues(datum['Tags']),
                country: splitCommaValues(datum['Country']),
                shippingInfo: datum['Shipping Info Text'],
                splitShipping: datum['Split Shipping'] === 'TRUE' ? 'shippingNotSplit' : 'shippingSplit',
                splitShippingBoolean: datum['Split Shipping'] === 'TRUE',
                shippingType: datum['Shipping Type'],
                winner: datum['Winner']
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
            donations2024: parseInt(datum['Total Donations 2024'].replace(/[^0-9]/, '')) || 0
        })).filter(x => x)

        // RAFL Pot Stats
        const raflPotStatsData = raflPotStats.map(datum => ({
            id: datum['Unique ID'],
            year: +datum['Year'],
            potNumber: datum['Pot Number'],
            title: datum['Pot Title'],
            tickets: datum['Tickets'],
            donors: datum['Donors']
        })).filter(x => x)

        // RAFL Charity Stats
        const raflCharityStatsData = raflCharityStats.map(datum => ({
            id: datum['Unique ID'],
            name: datum['Charity Name'],
            donations2025: parseInt(datum['Total Donations 2025'].replace(/[^0-9]/, '')) || 0
        })).filter(x => x)

        // RAFL Summary Stats
        const raflSummaryStatsData = raflSummaryStats.map(datum => ({
            donors: datum['Donors'],
            donationsTotal: parseInt(datum['Donation Total']?.replace(/[^0-9]/, '')) || 0,
            donationsReddit: parseInt(datum['From Reddit']?.replace(/[^0-9]/, '')) || 0,
            donationsDiscord: parseInt(datum['From Discord']?.replace(/[^0-9]/, '')) || 0,
            donationsTotal2024: parseInt(datum['2024 Raffle Total']?.replace(/[^0-9]/, '')) || 0
        })).filter(x => x)


        // All RAFL Stats
        const raflStatsData = {
            potStats: raflPotStatsData,
            charityStats: raflCharityStatsData,
            summaryStats: raflSummaryStatsData
        }

        const serverPath = process.env.LOGNAME === 'dh_m5s5pf'
            ? '/home/dh_m5s5pf/explore.lpubelts.com/public/data'
            : './'

        fs.writeFileSync(`${serverPath}/rafl.json`, JSON.stringify(raflMainData, null, 2))
        fs.writeFileSync(`${serverPath}/raflCharities.json`, JSON.stringify(raflCharities, null, 2))

        fs.writeFileSync(`${serverPath}/raflStats.json`, JSON.stringify(raflStatsData, null, 2))

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
