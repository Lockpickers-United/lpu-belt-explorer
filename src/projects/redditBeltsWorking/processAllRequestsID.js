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

const requestFile = fs.readFileSync('./allModUpdates+id.json', 'utf8')
const requests = JSON.parse(requestFile)

const atBelts = uniqueBelts.map(belt => `@${belt}`)

const requestInfo = requests
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    })
    .reduce((acc, request) => {
        const {userId, addedRole, tag} = request

        const belt = atBelts.find(belt => addedRole.includes(belt))
        if (!belt) return acc

        setDeepUnique(acc, ['belts', userId], belt.replace('@', ''))
        setDeep(acc, ['usernames', userId], tag)

        return acc
    }, {})

console.log('requestInfo', requestInfo.belts)

let beltCounts = {}

const changeData = Object.keys(requestInfo.belts).reduce((acc, user) => {

    const userBelts = requestInfo.belts[user].reduce((acc, belt, index) => {
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
            //setDeep(acc, ['Unranked', userBelt], 1)
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
        total: changeData[node]['Total'] || 0
    }
}).sort((a, b) => {
    return beltSort(a.id, b.id)
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
}, []).sort((a, b) => {
    return beltSort(a.source, b.source)
        || beltSort(a.target, b.target)
        || b.value - a.value
})

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
