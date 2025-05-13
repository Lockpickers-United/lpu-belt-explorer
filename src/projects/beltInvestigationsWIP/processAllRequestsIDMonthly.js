import fs from 'fs'
import {localUser, prodUser} from '../../../keys/users.js'
import {uniqueBelts, beltSort} from '../../util/belts.js'
import {setDeep, setDeepAdd, setDeepPush, setDeepUnique} from '../../util/setDeep.js'
import {jsonIt} from '../../util/jsonIt.js'
import dayjs from 'dayjs'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`

const requestFile = fs.readFileSync('./data/allModUpdates+id.json', 'utf8')
const requests = JSON.parse(requestFile)

const atBelts = uniqueBelts.map(belt => `@${belt}`)

const requestInfo = requests
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    })
    .reduce((acc, request) => {
        const {userId, addedRole, tag, createdAt} = request

        const belt = atBelts.find(belt => addedRole.includes(belt))
        if (!belt) return acc

        const beltName = belt.replace('@', '')
        const beltMonth = dayjs(createdAt).format('YYYY-MM')

        if (!!acc.belts && !!acc.belts[userId] && acc.belts[userId].includes(beltName)) return acc

        setDeepPush(acc, ['belts', userId], beltName)
        setDeepAdd(acc, ['totals', beltName], 1)

        setDeepAdd(acc, ['monthly', beltName, beltMonth], 1)
        setDeepUnique(acc, ['months'], beltMonth)

        return acc

    }, {})

console.log('requestInfo', requestInfo)

let discordMonthly = 'Belt,'
requestInfo.months.forEach(month => {
    discordMonthly += `${month},`
})
discordMonthly += '\n'

const monthlyTotals = uniqueBelts.reduce((acc, belt) => {
    discordMonthly += `${belt},`
    requestInfo.months.forEach(month => {
        const beltMonth = requestInfo.monthly[belt][month] || 0
        discordMonthly += `${beltMonth},`
        setDeepAdd(acc, [month], beltMonth)
    })
    discordMonthly += '\n'
    return acc
},[])

discordMonthly += `Total,`

Object.keys(monthlyTotals).forEach(month => {
        const beltMonth = monthlyTotals[month] || 0
        discordMonthly += `${beltMonth},`
})
discordMonthly += '\n'



await fs.writeFileSync(`${serverDir}/discordMonthly.csv`, discordMonthly, function (err) {
    if (err) {
        console.error('save discordMonthly.csv error:', err)
    }
})


console.log(discordMonthly)
