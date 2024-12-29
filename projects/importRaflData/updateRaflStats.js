import {raflUtils} from '../raflFormUtilities/raflFormUtils.js'
import fs from 'node:fs/promises'
import dayjs from 'dayjs'
import {localUser, prodUser, responseRecipients} from '../../keys/users.js'
import validator from 'validator'
import {sendEmail} from '../nodeMailer/nodeMailer.js'

export async function updateRaflStats() {

    const production = process.env.USER !== localUser
    const tempDir = production
        ? `/home/${prodUser}/rafl-stats-temp/`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL`

    try {

        // save current stats
        await raflUtils('processSheetsResponses').then()

        // compare to previous
        const previousResponses = JSON.parse(await fs.readFile(`${tempDir}/sheetsResponses.json`, 'utf8'))
        const previousLast = dayjs(previousResponses[previousResponses.length - 1].Timestamp)

        const currentResponses = await raflUtils('getSheetsResponses')

        const newResponses = currentResponses.filter(res => dayjs(res.Timestamp) > previousLast)
        if (newResponses.length > 0) console.log('New Responses')
        const newResponseInfo = newResponses.length > 0
            ? newResponses.reduce((acc, res) => {
                const tickets = Object.keys(res)
                    .filter(key => (/Pot/.test(key) && res[key] !== ''))
                    .reduce((acc, key) => {
                        acc = acc ? acc + parseInt(res[key]) : parseInt(res[key])
                        return acc
                    }, 0)
                const user = res['Platform Username'].charAt(0) + '...' + res['Platform Username'].slice(-1)
                let proof = res['Receipt from approved charity (hosted image link, must contain a visible date)']
                    .toLowerCase()
                proof = validator.isURL(proof) ? proof : proof.replace(/https*:\/\//g, '') + ' (bad url)'

                const text = {
                    timestamp: dayjs(res.Timestamp).format('MM/DD/YYYY HH:MM:ss'),
                    platform: res['Your Preferred Platform'],
                    user: user,
                    charity: res['Selected charity'],
                    donation: parseInt(res['Total donation in USD']),
                    donationProof: proof,
                    tickets: tickets,
                    match: tickets === parseInt(res['Total donation in USD']) ? 'totals match' : 'DONATION & TICKETS DO NOT MATCH'
                }

                let html = '<h3>New Response</h3>'
                html += '<div style="line-height: 1.3rem; margin-bottom: 20px">'
                html += `<b>Date:</b> ${text.timestamp}<br>`
                html += `<b>Platform:</b> ${text.platform}<br>`
                html += `<b>User:</b> ${text.user}<br>`
                html += `<b>Charity:</b> ${text.charity}<br>`
                html += `<b>Donation:</b> ${text.donation}<br>`
                html += `<b>Proof:</b> ${text.donationProof}<br>`
                html += `<b>Tickets:</b> ${text.tickets}<br>`
                html += `<b>Match?</b> ${text.match}<br>`
                html += '</div>'

                acc.text = acc.text ? [...acc.text, text] : [text]
                acc.html = acc.html ? acc.html + html : html

                return acc

            },{})
            : ''

        if (newResponses.length > 0) {
            jsonIt('html', newResponseInfo)

            await sendEmail(`New RAFL Entries since last update`, JSON.stringify(newResponseInfo.text, null, 2), newResponseInfo.html, responseRecipients)

            //await fs.writeFile(`${tempDir}/sheetsResponses.json`, JSON.stringify(currentResponses, null, 2))

        }

    } catch (err) {
        console.log('err', err)
    }
}

await updateRaflStats()

function jsonIt(string, object) {
    console.log(string)
    console.log(JSON.stringify(object, null, 2))
    console.log('--------')
}