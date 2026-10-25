import fs from 'node:fs/promises'
import {setDeep, setDeepAdd, setDeepMax, setDeepPush, setDeepUnique} from '../../../util/setDeep.js'
import {itemDetails} from '../../../util/getItemDetails.js'
import {loadDeprecatedKeysModule} from '../../../util/deprecatedKeys.js'
import dayjs from 'dayjs'
import backup from './backup.json' with {type: 'json'}

const {localUser, prodUser} = await loadDeprecatedKeysModule('users.js')

////
// NOTE: backup.json is pulled from current directory
////


/**
 * @property blackBeltAwardedAt
 * @property userIds
 * @property listUserIds
 * @property allLists
 */

const production = process.env.USER !== localUser

const backupDir = production
    ? `/home/${prodUser}/firebase/archive`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`
const dailyDir = production
    ? `/home/${prodUser}/firebase/collectionsDailyData`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/collectionsDailyData`
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`

//const listNames = ['own', 'picked', 'recorded', 'wishlist', 'safelocksOwn', 'safelocksCracked', 'safelocksWishlist', 'projects', 'raffleWatchlist', 'awards']
const listNames = ['own', 'picked', 'wishlist', 'safelocksOwn', 'safelocksCracked', 'safelocksWishlist', 'projects', 'raffleWatchlist', 'awards']

const items = await itemDetails()

export function getDuplicateValues(array) {
    const seen = new Set()
    const duplicates = new Set()

    array.forEach(value => {
        if (seen.has(value)) {
            duplicates.add(value)
        } else {
            seen.add(value)
        }
    })

    return [...duplicates]
}

export async function collectionAnalyzer({blackBeltOnly, userId}) {

    const collectionData = backup['__collections__']['lockcollections']

    const profiles = userId
        ? {[userId]: collectionData[userId]}
        : blackBeltOnly
            ? Object.keys(collectionData)
                .filter(key => collectionData[key].blackBeltAwardedAt)
                .reduce((acc, key) => {
                    acc[key] = collectionData[key]
                    return acc
                }, {})
            : collectionData

    const issues = Object.keys(profiles).reduce((acc, userId) => {
        acc = acc ? acc : {}
        const profile = profiles[userId]

        //console.log('userId', userId)

        listNames.forEach(listName => {
            if (profile[listName]?.length > 0) {
                const duplicateIds = getDuplicateValues(profile[listName])
                if (duplicateIds.length > 0) {
                    setDeepPush(acc, [userId, 'duplicates', listName], duplicateIds)
                }
                profile[listName].forEach(itemId => {
                    if (!items[itemId]) {
                        //setDeepPush(acc, [userId, 'badIds', listName], itemId)
                        //setDeepUnique(acc, ['allBadIds'], itemId)
                    }
                })
            }
        })

        return acc
    }, {})

    //console.log(JSON.stringify(issues, null, 2))
    return issues

}

await collectionAnalyzer({}).then(issues => console.log(JSON.stringify(Object.keys(issues), null, 2)))

process.exit(0)





export const getCollectionStatsCurrent = (profiles, items, listNames, blackBeltOnly) => {

    const collectionStatsCurrent = Object.keys(profiles).reduce((acc, userId) => {
        acc = acc ? acc : {}
        const profile = profiles[userId]
        setDeepAdd(acc, ['totalProfiles'], 1)

        if (blackBeltOnly) {
            setDeep(acc, ['blackBelts', userId], {
                displayName: profile.displayName || 'no display name',
                tabClaimed: profile.tabClaimed || 'no tab claimed'
            })
        }

        listNames.forEach(listName => {
            if (profile[listName]?.length > 0) {
                setDeepUnique(acc, ['listUserIds'], userId)
                setDeep(acc, ['listUsers'], acc.listUserIds.length)

                setDeepAdd(acc, ['listStats', listName, 'userCount'], 1)
                setDeepMax(acc, ['listStats', listName, 'maxSaves'], profile[listName].length)

                setDeepUnique(acc, ['listStats', 'allLists', 'userIds'], userId)
                setDeep(acc, ['listStats', 'allLists', 'userCount'], acc.listStats.allLists.userIds.length)
                setDeepMax(acc, ['listStats', 'allLists', 'maxSaves'], profile[listName].length)

                profile[listName].forEach(itemId => {
                    setDeepAdd(acc, ['totalSaves'], 1)
                    setDeepAdd(acc, ['listStats', listName, 'totalSaves'], 1)
                    setDeepAdd(acc, ['listStats', listName, 'savesById', itemId], 1)
                    setDeepAdd(acc, ['listStats', 'allLists', 'totalSaves'], 1)
                    setDeepAdd(acc, ['listStats', 'allLists', 'savesById', itemId], 1)

                    if (!blackBeltOnly) {
                        setDeepAdd(acc, ['allSavesById', itemId], 1)
                    }
                    if (items[itemId]) {
                        if (items[itemId].type === 'lock') {
                            setDeepAdd(acc, ['lockSaves'], 1)
                            setDeepAdd(acc, ['savesByBelt', items[itemId].belt, 'count'], 1)
                            setDeepAdd(acc, ['listSavesByBelt', listName, items[itemId].belt], 1)
                        } else if (items[itemId].type === 'award') {
                            setDeepAdd(acc, ['awardCounts', itemId], 1)
                            setDeepMax(acc, ['maxAward', userId], items[itemId].absRank)
                            setDeepAdd(acc, ['importSummary', 'totalAwards'], 1)
                        }
                    }
                })
            }
        })

        // AWARDS & IMPORT

        if (profile.discordUsername || profile.redditUsername) setDeepAdd(acc, ['importSummary', 'importUsers'], 1)
        if (profile.awards?.length > 0) setDeepAdd(acc, ['importSummary', 'awardUsers'], 1)

        // PROJECTS ????

        return acc
    }, {})

    if (collectionStatsCurrent.maxAward) {
        Object.keys(collectionStatsCurrent.maxAward).forEach(userId => {
            const awardId = Object.keys(items).find(itemId => collectionStatsCurrent.maxAward[userId] === items[itemId].absRank)
            setDeepAdd(collectionStatsCurrent, ['maxAwardCounts', awardId], 1)

            // Don't need in each 'current' file?
            setDeep(collectionStatsCurrent, ['awardsDisplayNames', userId, 'maxAward'], items[awardId].absRank)
            setDeep(collectionStatsCurrent, ['awardsDisplayNames', userId, 'displayName'], profiles[userId].displayName)
        })
        delete collectionStatsCurrent.maxAward
    }

    if (collectionStatsCurrent.savesByBelt) {
        Object.keys(collectionStatsCurrent.savesByBelt).forEach(belt => {
            setDeep(collectionStatsCurrent, ['savesByBelt', belt, 'value'],
                collectionStatsCurrent.savesByBelt[belt].count / collectionStatsCurrent.lockSaves)
        })
    }

    const allListNames = [...listNames, 'allLists']
    allListNames.forEach(listName => {
        if (collectionStatsCurrent.listStats && collectionStatsCurrent.listStats[listName]) {
            collectionStatsCurrent.listStats[listName].averageSaves =
                collectionStatsCurrent.listStats[listName].totalSaves / collectionStatsCurrent.listStats[listName].userCount
            const savesById = collectionStatsCurrent.listStats[listName].savesById


            //console.log(listName, savesById)
            //setDeep(collectionStatsCurrent, ['savesById', listName], savesById)


            const topItems = Object.keys(savesById)
                .sort((a, b) => {
                    return savesById[b] - savesById[a] ||
                        items[a]?.shortName.localeCompare(items[b]?.shortName)
                })
                .map((itemId, index) => {
                    return {id: itemId, saveCount: savesById[itemId], name: items[itemId]?.shortName, rank: index + 1}
                })
            collectionStatsCurrent.listStats[listName]['topItems'] = listName === 'recordedLocks'
                ? topItems.slice(0, 300)
                : topItems.slice(0, 25)

            delete collectionStatsCurrent.listStats[listName].savesById
        }
    })
    if (collectionStatsCurrent?.listUserIds) delete collectionStatsCurrent.listUserIds
    if (collectionStatsCurrent?.listStats?.allLists?.userIds) delete collectionStatsCurrent.listStats.allLists.userIds
    //if (Object.keys(issues).length > 0) collectionStatsCurrent.issues = issues

    return collectionStatsCurrent

}

async function analyzeCollection(date) {
    const allUsers = await collectionAnalyzer({blackBeltOnly: false, date})

    await fs.writeFile(`${serverDir}/collectionStatsById.json`, JSON.stringify(allUsers.allSavesById), function (err) {
        if (err) {
            console.error('save collectionStatsById error:', err)
        }
    })
    delete allUsers.allSavesById


    const blackBeltOnly = await collectionAnalyzer({blackBeltOnly: true, date})
    const metadata = {updatedDateTime: new Date().toISOString()}
    const collectionStatsCurrent = {metadata, allUsers, blackBeltOnly}


    await fs.writeFile(`${dailyDir}/collectionStats_${date}.json`, JSON.stringify(collectionStatsCurrent), function (err) {
        if (err) {
            console.error('save collectionStats for date error:', err)
        }
    })

    await fs.writeFile(`${serverDir}/collectionStatsCurrent.json`, JSON.stringify(collectionStatsCurrent), function (err) {
        if (err) {
            console.error('save collectionStatsCurrent error:', err)
        }
    })
}

// LEADERBOARD


const backupFiles = (await fs.readdir(backupDir)).filter(file => file.includes('backup_'))
const statsFiles = (await fs.readdir(dailyDir)).filter(file => file.includes('collectionStats'))

const backupDates = backupFiles.map(file => file.replace('backup_', '').replace('.json', ''))
const statsDates = statsFiles.map(file => file.replace('collectionStats_', '').replace('.json', ''))

const today = dayjs().format('YYYY-MM-DD')
const notProcessed = backupDates.filter(item => !statsDates.includes(item) || item === today)

//console.log('notProcessed', notProcessed)
notProcessed.forEach(date => {
    analyzeCollection(date).then()
})
