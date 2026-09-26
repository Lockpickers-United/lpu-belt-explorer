import fs from 'node:fs/promises'
import path from 'node:path'
import dayjs from 'dayjs'
import {localUser, prodUser, responseRecipients} from '../../../keys/users.js'
import validator from 'validator'
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import isDirectRun from '../../util/isDirectRun.js'
import {loadRuntimeEnvironment} from '../../util/runtimeEnvironment.js'

const projectRoot = path.resolve(import.meta.dirname, '../../..')

export function loadUpdateRaflStatsConfig(env = process.env) {
    const production = env.USER !== localUser
    const keysDir = production
        ? `/home/${prodUser}/explore-lpubelts-com-node/keys`
        : `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node/keys`
    const tempDir = production
        ? `/home/${prodUser}/rafl-stats-temp`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL`

    return Object.freeze({
        environment: env.NODE_ENV || 'local',
        production,
        credentialsPath: path.join(keysDir, 'credentials.json'),
        tokenPath: path.join(keysDir, 'token-forms.json'),
        tempDir
    })
}

export function updateRaflStatsConfigSummary(config) {
    return {...config}
}

async function loadRaflUtils() {
    return (await import('../raflFormUtilities/raflFormUtils.js')).raflUtils
}

export async function updateRaflStats({
    tempDir = loadUpdateRaflStatsConfig().tempDir,
    raflUtilsFn
} = {}) {

    const runRaflUtility = raflUtilsFn || await loadRaflUtils()

    try {

        // UPDATE STATS FOR SITE
        await runRaflUtility('processSheetsResponses').then()

        // GET RAFL DATA
        const raflData = await runRaflUtility('getRaflData').then()

        // COMPARE TO PREVIOUS
        const previousResponses = JSON.parse(await fs.readFile(`${tempDir}/sheetsResponses.json`, 'utf8'))
        const previousLast = dayjs(previousResponses[previousResponses.length - 1]['Date'])

        const allResponses = await runRaflUtility('getSheetsResponses')
        const currentResponses = allResponses.filter(res => res['Good to go'] !== 'TEST')
        const totalDonations = currentResponses.reduce((acc, res) => {
            acc = acc + parseInt(res['Donation'])
            return acc
        },0)

        //jsonIt('currentResponses', currentResponses)

        const approvedResponses = currentResponses.filter(res => res['Good to go'] === 'TRUE')
        const approvedResponseCount = approvedResponses.length
        const approvedDonations = approvedResponses.reduce((acc, res) => {
            acc = acc + parseInt(res['Donation'])
            return acc
        },0)

        const newResponses = currentResponses.filter(res => dayjs(res['Date']) > previousLast)

        const newResponseInfo = newResponses.length > 0
            ? newResponses.reduce((acc, res) => {
                const tickets = Object.keys(res)
                    .filter(key => (/Pot/.test(key) && res[key] !== ''))
                    .reduce((acc, key) => {
                        acc = acc ? acc + parseInt(res[key]) : parseInt(res[key])
                        return acc
                    }, 0)
                const user = res['Name or Email'].charAt(0) + '...' + res['Name or Email'].slice(-1)
                let proof = res['Receipt']
                    .toLowerCase()
                proof = validator.isURL(proof) ? proof : proof.replace(/https*:\/\//g, '') + ' (bad url)'

                const potTickets = Object.keys(res)
                    .filter(key => (/Pot/.test(key) && res[key] !== ''))
                    .map(key => {
                        const pot = raflData.find(pot => pot.potNumber === key.replace('Pot ', ''))
                        return pot ? {pot: key, title: pot.title, tickets: parseInt(res[key])} : {pot: key, tickets: parseInt(res[key])}
                    })

                const text = {
                    totalResponses: currentResponses.length,
                    approvedResponses: approvedResponseCount,
                    pendingResponses: currentResponses.length - approvedResponseCount,
                    totalDonations: totalDonations,
                    approvedDonations: approvedDonations,
                    timestamp: dayjs(res.Date).format('MM/DD/YYYY HH:MM:ss'),
                    platform: res['Platform'],
                    user: user,
                    charity: res['Charity Name'],
                    donation: parseInt(res['Donation']),
                    donationProof: proof,
                    tickets: tickets,
                    match: tickets === parseInt(res['Donation']) ? 'totals match' : 'DONATION & TICKETS DO NOT MATCH'
                }

                let html = '<h3>Response Summary</h3>'
                html += '<div style="line-height: 1.3rem; margin-bottom: 20px">'
                html += `<b>Total Responses:</b> ${currentResponses.length}<br>`
                html += `<b>Approved:</b> ${approvedResponseCount}<br>`
                html += `<b>Pending:</b> ${currentResponses.length - approvedResponseCount}<br>`
                html += `<b>Total Donations:</b> $${totalDonations}<br>`
                html += `<b>Approved Donations:</b> $${approvedDonations}<br>`
                html += '</div>'
                html += '<h3>New Response</h3>'
                html += '<div style="line-height: 1.3rem; margin-bottom: 20px">'
                html += `<b>Date:</b> ${text.timestamp}<br>`
                html += `<b>Platform:</b> ${text.platform}<br>`
                html += `<b>User:</b> ${text.user}<br>`
                html += `<b>Charity:</b> ${text.charity}<br>`
                html += `<b>Donation:</b> ${text.donation}<br>`
                html += `<b>Proof:</b> ${text.donationProof}<br>`
                html += `<b>Tickets:</b> ${text.tickets}<br>`
                html += `<b>Match?</b> ${text.match}<br>`

                html += '<b>POTS</b><br>'
                potTickets.map(pot => {
                    html += `<b>${pot.title}:</b> ${pot.tickets}<br>`
                })

                html += '</div>'

                acc.text = acc.text ? [...acc.text, text] : [text]
                acc.html = acc.html ? acc.html + html : html

                return acc

            },{})
            : ''

        if (newResponses.length > 0) {
            //jsonIt('text', newResponseInfo.text)

            await fs.writeFile(`${tempDir}/sheetsResponses.json`, JSON.stringify(currentResponses, null, 2))
            await sendEmail('New RAFL Entries since last update', JSON.stringify(newResponseInfo.text, null, 2), newResponseInfo.html, responseRecipients)

        }

    } catch (err) {
        console.log('err', err)
    }
}

export async function updateRaflStatsMain({
    env = process.env,
    argv = process.argv,
    loadEnvironment,
    writeOutput = console.log,
    updateStatsFn = updateRaflStats
} = {}) {
    loadRuntimeEnvironment({env, envDir: projectRoot, loadEnvironment})
    const config = loadUpdateRaflStatsConfig(env)
    const summary = updateRaflStatsConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    return updateStatsFn({tempDir: config.tempDir})
}

if (isDirectRun(import.meta.url)) {
    await updateRaflStatsMain()
}
