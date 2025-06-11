import fs from 'fs'
import {localUser, prodUser} from '../../../keys/users.js'
import {uniqueBelts, beltRoles, beltSort} from '../../util/belts.js'
import {setDeep, setDeepAdd, setDeepPush, setDeepUnique} from '../../util/setDeep.js'
import {jsonIt} from '../../util/jsonIt.js'
import dayjs from 'dayjs'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`

const requestFile = fs.readFileSync('./data/allModUpdates.json', 'utf8')
const requests = JSON.parse(requestFile)

const belts = uniqueBelts.map(belt => `${belt} Belt`)


// Clean up raw change logs

const allRoleChanges = requests
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
            || a.userId.localeCompare(b.userId)
            || b.role.localeCompare(a.role)
    })
    .reduce((acc, request) => {
        const {userId, changeType, role, username, createdAt} = request

        acc.prevTime = acc.prevTime ? acc.prevTime : 0
        let cleanedCreatedAt = dayjs(createdAt).toISOString()
        if (acc.prevTime === createdAt) {
            cleanedCreatedAt = dayjs(createdAt).add(1, 'millisecond').toISOString()
        }

        if (role !== '20th Dan') {
            const cleanRole = role.includes('Dan') ? 'Black Belt' : role
            setDeepPush(acc, [userId], {
                belt: cleanRole,
                changeType,
                username,
                createdAt: cleanedCreatedAt
            })
        }

        acc.prevTime = createdAt
        return acc

    }, {})
delete allRoleChanges.prevTime


// Orgainze & process allRoleChanges by user

const allBeltRoles = ['Unranked', ...beltRoles]
const roleChanges = Object.keys(allRoleChanges).reduce((acc, userId) => {
    setDeepAdd(acc, ['userCount'], 1)

    allRoleChanges[userId].forEach((change) => {

        const {belt, changeType, username, createdAt} = change
        setDeep(acc, [userId, 'currentBelt'], acc[userId] ? acc[userId].currentBelt : 'Unranked')
        if ((allBeltRoles.indexOf(belt) <= allBeltRoles.indexOf(acc[userId].currentBelt))) return acc

        if (changeType === 'added') {
            setDeepPush(acc, ['changes', userId], {
                belt: acc[userId].currentBelt,
                changeType: 'removed',
                username,
                createdAt: dayjs(createdAt).subtract(1, 'second').toISOString()
            })
            setDeepPush(acc, ['changes', userId], {belt, changeType: 'added', username, createdAt})
            setDeepAdd(acc, ['totals', belt], 1)
            setDeepAdd(acc, ['flows', acc[userId].currentBelt, belt], 1)
            setDeepPush(acc, ['flowsByTime'], {createdAt, source: acc[userId].currentBelt, target: belt})

            acc[userId].currentBelt = belt
        }
    })
    return acc
}, {})

//console.log('roleChanges.flowsByTime\n', roleChanges.flowsByTime)

// Flatten roleChanges from userId to all changes by time

const roleChangesFlat = Object.keys(roleChanges.changes).reduce((acc, userId) => {
    roleChanges.changes[userId].forEach((change) => {
        acc.push(change)
    })
    return acc
}, [])
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    })

// tally up totals and mothly changes
// TODO: just use simple "flows" object to track totals?

const monthlyChanges = roleChangesFlat.reduce((acc, change) => {

    const {belt, changeType, createdAt} = change
    const beltMonth = dayjs(createdAt).format('YYYY-MM')
    setDeepUnique(acc, ['months'], beltMonth)

    setDeepAdd(acc, ['previousMonth', belt, 'net'], 0)
    setDeepAdd(acc, ['monthly', beltMonth, belt, 'net'], 0)

    setDeepAdd(acc, ['totals', belt], changeType === 'added' ? 1 : -1)
    setDeep(acc, ['monthly', beltMonth, belt, 'net'], acc.totals[belt])
    setDeepAdd(acc, ['monthly', beltMonth, belt, changeType], 1)

    allBeltRoles.forEach(belt => {
        if (!acc.monthly[beltMonth][belt]) {
            setDeep(acc, ['monthly', beltMonth, belt, 'net'], acc.totals[belt] || 0)
        }
    })

    return acc
}, {})

//jsonIt('monthlyChanges', monthlyChanges)


//
// monthly belt totals: monthlyChanges.monthly[beltMonth][belt].net


// SANKEY DATA




let tempBelts = ['Unranked', ...belts]

console.log('belts', belts)


const nodes = tempBelts.map(belt => {
    const beltName = belt.replace(' Belt', '')
    return {
        id: beltName,
        group: 1,
        total: monthlyChanges.totals[belt] || 0
    }
}).sort((a, b) => {
    return beltSort(a.id, b.id)
})




const flowTotalsByMonth = roleChanges.flowsByTime
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    })
    .reduce((acc, flow) => {
        const {createdAt, source, target} = flow
        const beltMonth = dayjs(createdAt).format('YYYY-MM')

        setDeepAdd(acc, ['total', source, target], 1)

        Object.keys(acc.total).forEach(source => {
            Object.keys(acc.total[source]).forEach(target => {
                setDeep(acc, ['monthly', beltMonth, source, target], (acc.total[source]) ? acc.total[source][target] : 0)
            })
        })
        return acc
    }, {})

//jsonIt('flowTotalsByMonth', flowTotalsByMonth)


const flowsByMonth = roleChanges.flowsByTime
    .sort((a, b) => {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    })
    .reduce((acc, flow) => {
        const {createdAt, source, target} = flow
        const beltMonth = dayjs(createdAt).format('YYYY-MM')

        setDeepAdd(acc, ['total', source, target], 1)
        setDeepAdd(acc, ['runningTotals', beltMonth, target], 1)

        setDeepAdd(acc, ['monthly', beltMonth, source, target], 1)


        Object.keys(acc.total).forEach(source => {
            Object.keys(acc.total[source]).forEach(target => {
                setDeepAdd(acc, ['monthlyOld', beltMonth, source, target], 1)
            })
        })
        return acc
    }, {})


//jsonIt('roleChanges.flowsByTime', roleChanges.flowsByTime)
//console.log('flowsByMonth', flowsByMonth.monthly)

// Sankey Totals Only

const links = tempBelts.reduce((acc, belt) => {
    const beltName = belt.replace(' Belt', '')

    const month = dayjs().format('YYYY-MM')

    if (belt === 'Black Belt') return acc

    if (flowTotalsByMonth.monthly[month][belt]) {
        Object.keys(flowTotalsByMonth.monthly[month][belt]).forEach(target => {
            if (target === 'Total') return acc
            acc.push({
                source: beltName,
                target: target.replace(' Belt', ''),
                value: flowTotalsByMonth.monthly[month][belt][target] || 0
            })
        })
    }
    return acc
}, []).sort((a, b) => {
    return beltSort(a.source, b.source)
        || beltSort(a.target, b.target)
        || b.value - a.value
})

const sankeyDataTot = {nodes, links}

jsonIt('sankeyDataTot', sankeyDataTot)

process.exit()



// Sankey Monthly

const monthlyLinks = Object.keys(flowTotalsByMonth.monthly)
    .sort((a, b) => {
        return dayjs(a).valueOf() - dayjs(b).valueOf()
    })
    .reduce((monthAcc, month) => {

        const links = belts.reduce((acc, belt) => {
            const beltName = belt.replace(' Belt', '')

            if (belt === 'Black Belt') return acc

            if (flowTotalsByMonth.monthly[month][belt]) {
                Object.keys(flowTotalsByMonth.monthly[month][belt]).forEach(target => {
                    if (target === 'Total') return acc
                    acc.push({
                        source: beltName,
                        target: target.replace(' Belt', ''),
                        value: flowTotalsByMonth.monthly[month][belt][target] || 0
                    })
                })
            }
            return acc
        }, []).sort((a, b) => {
            return beltSort(a.source, b.source)
                || beltSort(a.target, b.target)
                || b.value - a.value
        })

        monthAcc[month] = links

        return monthAcc
    }, {})

const sankeyData = {nodes, links}
jsonIt('sankeyData\n', sankeyData)

await fs.writeFileSync(`./data/sankeyData.json`, JSON.stringify(sankeyData, null, 2), function (err) {
    if (err) {
        console.error('save sankeyData.json error:', err)
    }
})

process.exit()

// CHORD DATA
// total
const chordData = belts.reduce((acc, belt) => {
    const beltName = belt.replace(' Belt', '')

    const beltChords = belts.reduce((beltAcc, target) => {
        beltAcc = beltAcc.length > 0 ? beltAcc : []
        if (target === 'Total') return beltAcc

        const subTotal = target === belt
            ? monthlyChanges.totals[belt] || 0
            : roleChanges.flows[belt] && roleChanges.flows[belt][target]
                ? roleChanges.flows[belt][target]
                : roleChanges.flows[target] && roleChanges.flows[target][belt]
                    ? roleChanges.flows[target][belt]
                    : 0

        beltAcc.push(subTotal)
        setDeepAdd(acc, ['totals', beltName], subTotal)
        return beltAcc
    }, [])

    setDeepPush(acc, ['chords'], beltChords)
    return acc

}, {})

jsonIt('chordData', chordData)

process.exit()


const totalUsers = roleChanges.userCount
let totalRoles = Object.keys(chordData.totals).reduce((acc, belt) => {
    acc += chordData.totals[belt]
    return acc
}, 0)

// monthly belt totals: monthlyChanges.monthly[beltMonth][belt].net


// Monthly Chord
const monthlyChordData = Object.keys(flowTotalsByMonth.monthly)
    .sort((a, b) => {
        return dayjs(a).valueOf() - dayjs(b).valueOf()
    })
    .reduce((monthAcc, month) => {

        const chordData = belts.reduce((acc, belt) => {
            const beltName = belt.replace(' Belt', '')

            const beltChords = belts.reduce((beltAcc, target) => {
                beltAcc = beltAcc.length > 0 ? beltAcc : []
                if (target === 'Total') return beltAcc

                const subTotal = target === belt
                    ? monthlyChanges.monthly[month][belt].net
                    : flowsByMonth.monthly[month][belt] && flowsByMonth.monthly[month][belt][target]
                        ? flowsByMonth.monthly[month][belt][target]
                        : flowsByMonth.monthly[month][target] && flowsByMonth.monthly[month][target][belt]
                            ? flowsByMonth.monthly[month][target][belt]
                            : 0

                beltAcc.push(subTotal)
                return beltAcc
            }, [])

            setDeepAdd(acc, ['allocatedTotal'], monthlyChanges.monthly[month][belt].net)

            setDeepPush(acc, ['chords'], [...beltChords, 0])
            return acc

        }, {})

        const noBelts = belts.reduce((noBeltacc, belt) => {
            noBeltacc.push(0)
            return noBeltacc
        }, [])


        setDeepAdd(monthAcc, [month, 'allocatedTotal'], chordData.allocatedTotal)
        console.log('foo', month, monthAcc[month].allocatedTotal)


        // add final chord for unallocated future users
        chordData.chords.push([...noBelts, (totalUsers - monthAcc[month].allocatedTotal)])
        setDeep(monthAcc, [month], chordData)
        return monthAcc

    }, {})

jsonIt('monthlyChordData', monthlyChordData)


await fs.writeFileSync(`./data/monthlyChordData.json`, JSON.stringify(monthlyChordData, null, 2), function (err) {
    if (err) {
        console.error('save monthlyChordData.json error:', err)
    }
})


process.exit()


// MONTHLY


const requestsMonthlyByBelt = monthlyChanges.months
    .sort((a, b) => {
        return dayjs(a).valueOf() - dayjs(b).valueOf()
    })
    .reduce((acc, month) => {
        Object.keys(monthlyChanges.monthly[month]).forEach(belt => {
            const monthInfo = monthlyChanges.monthly[month][belt]
            setDeep(acc, [belt, month], monthInfo)
        })
        return acc
    }, {})

monthlyChanges.monthlyByBelt = requestsMonthlyByBelt


//jsonIt('monthlyChanges', monthlyChanges)


// CREATE MONTHLY CSV

let discordMonthly = 'Belt,'
monthlyChanges.months.forEach(month => {
    discordMonthly += `${month},`
})
discordMonthly += '\n'

const monthlyTotals = beltRoles.slice(0, 29).reduce((acc, belt) => {
    discordMonthly += `${belt},`
    monthlyChanges.months.forEach(month => {
        const beltMonth = !!monthlyChanges.monthlyByBelt[belt][month] ? monthlyChanges.monthlyByBelt[belt][month].net : 0
        discordMonthly += `${beltMonth},`
        setDeepAdd(acc, [month], beltMonth)
    })
    discordMonthly += '\n'
    return acc
}, [])

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

console.log(`discordMonthly\n${discordMonthly}`)
