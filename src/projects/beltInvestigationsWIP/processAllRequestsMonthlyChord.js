import fs from 'fs'
import {localUser, prodUser} from '../../../keys/users.js'
import {uniqueBelts, beltRoles, beltSort} from '../../util/belts.js'
import {setDeep, setDeepAdd, setDeepCreate, setDeepPush, setDeepUnique} from '../../util/setDeep.js'
import {jsonIt} from '../../util/jsonIt.js'
import dayjs from 'dayjs'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`

const requestFile = fs.readFileSync('./data/allModUpdates.json', 'utf8')
const requests = JSON.parse(requestFile)

const requestInfo = requests
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    })
    .reduce((acc, request) => {
        const {userId, changeType, role, username, displayName, createdAt} = request

        if (role.includes('White')) {
            //console.log(`${role},${changeType},${createdAt},${userId},${username},${displayName}` )
        }


        // TODO : handle dans
        // this is already filtered in the getModRequestsBelts.js

        const belt = uniqueBelts.find(belt => role.includes(belt))
        if (!belt) return acc

        const beltMonth = dayjs(createdAt).format('YYYY-MM')

        setDeepUnique(acc, ['months'], beltMonth)

        // TODO: handle if belt is already in the list ??
        //if (!!acc.belts && !!acc.belts[userId] && acc.belts[userId].includes(belt)) return acc

        setDeepPush(acc, ['belts', userId], {belt, changeType, username, createdAt})
        setDeepAdd(acc, ['totals', belt], changeType === 'added' ? 1 : -1)

        setDeepCreate(acc, ['previousMonth', belt, 'net'], 0)
        setDeepCreate(acc, ['monthly', beltMonth, belt,'net'], 0)

        if (acc.monthly[beltMonth][belt].net === 0) {
            acc.monthly[beltMonth][belt].net = acc.previousMonth[belt].net || 0
        }

        setDeepAdd(acc, ['monthly', beltMonth, belt,  'net'], changeType === 'added' ? 1 : -1)
        setDeepAdd(acc, ['monthly', beltMonth, belt,  changeType], 1)

        setDeep(acc, ['previousMonth', belt, 'net'], acc.monthly[beltMonth][belt].net)

        uniqueBelts.forEach(belt => {
            if (!acc.monthly[beltMonth][belt]) {
                const previousNet = acc.previousMonth[belt] ? acc.previousMonth[belt].net : 0
                setDeep(acc, ['monthly', beltMonth, belt, 'net'], previousNet)
            }
        })

        return acc

    }, {})

const requestsMonthlyByBelt = Object.keys(requestInfo.monthly).reduce((acc, month) => {
    Object.keys(requestInfo.monthly[month]).forEach(belt => {
        const monthInfo = requestInfo.monthly[month][belt]
        setDeep(acc, [belt, month], monthInfo)
    })
    return acc
},{})

requestInfo.monthlyByBelt = requestsMonthlyByBelt

jsonIt('requestInfo', requestInfo.belts)





// CREATE MONTHLY CSV

let discordMonthly = 'Belt,'
requestInfo.months.forEach(month => {
    discordMonthly += `${month},`
})
discordMonthly += '\n'

const monthlyTotals = uniqueBelts.reduce((acc, belt) => {
    discordMonthly += `${belt},`
    requestInfo.months.forEach(month => {
        const beltMonth = !!requestInfo.monthlyByBelt[belt][month] ? requestInfo.monthlyByBelt[belt][month].net : 0
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

//await fs.writeFileSync(`${serverDir}/discordMonthly.csv`, discordMonthly, function (err) {
await fs.writeFileSync(`./discordMonthly.csv`, discordMonthly, function (err) {
    if (err) {
        console.error('save discordMonthly.csv error:', err)
    }
})

jsonIt(discordMonthly)
