import fs from 'fs'
import {localUser, prodUser} from '../../../keys/users.js'
import {beltSort} from '../../util/belts.js'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`

const redditBeltFile = fs.readFileSync('./redditBeltsWIP.json', 'utf8')
const redditBeltData = JSON.parse(redditBeltFile)

const beltCounts = redditBeltData.reduce((acc, user) => {
    let beltName = null

    const target = 'Legendary Black Belt'
    if (user.flair_text.includes(target)) {
        console.log('found', target, user.user)
    }

    if (user.flair_text.match(/(.*)\sBelt/)) {
        const match = user.flair_text.match(/^.*?Belt/)
        beltName = match ? match[0] : null
        beltName = beltName === 'Legendary Black Belt' ? 'Black Belt' : beltName
    }
    if (beltName) {
        acc[beltName] = (acc[beltName] || 0) + 1
    }
    return acc
}, {})


await fs.writeFileSync(`${serverDir}/redditBeltCounts.json`, JSON.stringify(beltCounts, null, 2), function (err) {
    if (err) {
        console.error('save redditBeltCounts.json error:', err)
    }
})

const beltCountsCsv = 'Belt,Count\n'
    + Object.keys(beltCounts)
        .sort((a, b) => {
            return beltSort(a.replace(' Belt',''), b.replace(' Belt',''))
        })
        .reduce((acc, role) => {
            return acc + `${role},${beltCounts[role]}\n`
        }, '')


await fs.writeFileSync(`${serverDir}/redditBeltCounts.csv`, beltCountsCsv, function (err) {
    if (err) {
        console.error('save redditBeltCounts.csv error:', err)
    }
})


console.log(beltCountsCsv)
