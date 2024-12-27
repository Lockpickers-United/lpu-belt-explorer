import {raflUtils} from '../raflFormUtilities/raflFormUtils.js'
import fs from 'node:fs/promises'
import dayjs from 'dayjs'
import {localUser, prodUser} from '../../keys/users.js'
import validator from 'validator'

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
            ? newResponses.map(res => {
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

                const match = (tickets === parseInt(res['Total donation in USD'])) ? 'totals match' : 'DONATION & TICKETS DO NOT MATCH'

                console.log('timestamp: ' + dayjs(res.Timestamp).format('MM/DD/YYYY HH:MM:ss'))
                console.log('  platform: ' + res['Your Preferred Platform'])
                console.log('  user: ' + user)
                console.log('  charity: ' + res['Selected charity'])
                console.log('  donation: $' + parseInt(res['Total donation in USD']))
                console.log('  proof: ' + proof)
                console.log('  tickets: ' + tickets)
                console.log('  match: ' + match)
                console.log(' ')

                return {
                    timestamp: dayjs(res.Timestamp).format('MM/DD/YYYY HH:MM:ss'),
                    platform: res['Your Preferred Platform'],
                    user: user,
                    charity: res['Selected charity'],
                    donation: parseInt(res['Total donation in USD']),
                    donationProof: proof,
                    tickets: tickets,
                    match: tickets === parseInt(res['Total donation in USD']) ? 'totals match' : 'DONATION & TICKETS DO NOT MATCH'
                }
            })
            : ''

        if (newResponses.length > 0) {
            //jsonIt('New responses since last update', newResponseInfo)
            await fs.writeFile(`${tempDir}/sheetsResponses.json`, JSON.stringify(currentResponses, null, 2))
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