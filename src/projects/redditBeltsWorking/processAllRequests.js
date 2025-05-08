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

const requestFile = fs.readFileSync('./allBeltRequestsLPUBeltBot.json', 'utf8')
const requests = JSON.parse(requestFile)

const lcBelts = uniqueBelts.map(belt => belt.toLowerCase())

const requestInfo = requests
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    })
    .reduce((acc, request) => {
        const {id, createdAt, tag, content} = request
        let cleanContent = content.toLowerCase()
            .replace('requests', 'request')
            .replace('ing', '')
            .replaceAll(/[.,;\[\]<>{}-]/g, '')
            .replaceAll('belt', '')

        cleanContent += ' '

        let belt = cleanContent.match(/request\s+([a-zA-Z]+).+/i) ? cleanContent.match(/request\s+([a-zA-Z]+).+/i)[1] : null
        let dan = cleanContent.match(/request\s+(\d+\w+)\s+/i) ? cleanContent.match(/request\s+(\d+\w+)\s+/i)[1] : null

        belt = belt && lcBelts.includes(belt) ? belt.charAt(0).toUpperCase() + belt.slice(1) : null

        //const rank = belt ? belt : dan
        const rank = belt
        if (!rank) return acc

        setDeepUnique(acc, [tag], rank)

        return acc
    }, {})

console.log('requestInfo', requestInfo)

let beltCounts = {}

const changeData = Object.keys(requestInfo).reduce((acc, user) => {

    const userBelts = requestInfo[user].reduce((acc, belt, index) => {
        if (index === 0) {
            acc.push(belt)
        } else if (uniqueBelts.indexOf(belt) > uniqueBelts.indexOf(acc[acc.length - 1])) {
            acc.push(belt)
        }
        return acc
    }, [])


    let prevBelt = null

    userBelts.reduce((acc2, userBelt) => {

        beltCounts[userBelt] = beltCounts[userBelt] ? beltCounts[userBelt] + 1 : 1

        //if (!prevBelt && userBelt !== 'White') return acc2

        if (prevBelt) {
            setDeepAdd(acc, [prevBelt, userBelt], 1)
        } else {
            setDeep(acc, ['Unranked', userBelt], 1)
        }

        setDeepAdd(acc, [userBelt, 'Total'], 1)

        prevBelt = userBelt
        return acc2
    }, {})

    return acc

}, {})

console.log('beltCounts', beltCounts)
jsonIt('changeData', changeData)

const nodes = Object.keys(changeData).map(node => {
    return {
        id: node,
        group: 1,
        total: changeData[node]['Total'] || 0,
    }
}). sort((a, b) => {
    return beltSort(a.id,b.id)
})

const links = Object.keys(changeData).reduce((acc, node) => {
    Object.keys(changeData[node]).forEach(target => {
        if (target === 'Total') return acc
        acc.push({
            source: node,
            target: target,
            value: changeData[node][target]
        })
    })
    return acc
}, [])

jsonIt({nodes, links})

process.exit()


await fs.writeFileSync(`${serverDir}/redditBeltCounts.json`, JSON.stringify(requestInfo, null, 2), function (err) {
    if (err) {
        console.error('save redditBeltCounts.json error:', err)
    }
})


const beltCountsCsv = 'Belt,Count\n'

await fs.writeFileSync(`${serverDir}/redditBeltCounts.csv`, beltCountsCsv, function (err) {
    if (err) {
        console.error('save redditBeltCounts.csv error:', err)
    }
})


console.log(beltCountsCsv)
