import fs from 'fs'
import {parse} from 'csv-parse/sync'
import fetch from 'node-fetch'
import {
    raflPotStatsSchema,
    raflCharityStatsSchema,
    raflSummaryStatsSchema
} from './src/schemas.js'
import validate from './src/validate.js'

import {sheetIds} from '../../../keys/raflSheetIds.js'
const {raflStatsId} = sheetIds

export default async function updateRaflStatsOLD() {
    let errors = []

    try {

        // Helper to load and validate a file
        const importValidate = async (tab, schema) => {

            if (!raflStatsId) {
                console.log('Config error! Set RAFL_STATS_ID var to run update.')
                process.exit(1)
            }

            const safeTab = encodeURI(tab)
            const url = `https://docs.google.com/spreadsheets/d/${raflStatsId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
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

        const raflPotStats = await importValidate('RAFL Pot Stats', raflPotStatsSchema)
        const raflCharityStats = await importValidate('RAFL Charity Stats', raflCharityStatsSchema)
        const raflSummaryStats = await importValidate('RAFL Summary Stats', raflSummaryStatsSchema)

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

        fs.writeFileSync(`${serverPath}/raflStats.json`, JSON.stringify(raflStatsData, null, 2))

    } catch (err) {
        console.log('err', err)
        errors.push(err)
    }

    return errors.length > 0
        ? {status: 'Errors', errors: errors}
        : {status: 'All Good!'}

}

updateRaflStatsOLD().then()

//console.log('Complete.', {raflData: raflMainData, raflCharities: raflCharities})
