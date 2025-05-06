import fs from 'node:fs/promises'
import {setDeepPush} from '../../util/setDeep.js'
import path from 'node:path'

import {localUser, prodUser} from '../../../keys/users.js'

const production = process.env.USER !== localUser

const dailyDir = production
    ? `/home/${prodUser}/firebase/collectionsDailyData`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/collectionsDailyData`
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data/`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`

export async function collectionStatsProcess() {

    const dailyFiles = (await readFilesInDirectory(dailyDir))
    const dailyData = await Promise.all(dailyFiles.map(async (file) => {
        return {file: file.file, content: JSON.parse(file.content)}
    }))

    const cohorts = ['allUsers', 'blackBeltOnly']
    const dailyStats = dailyData.reduce((acc, daily) => {
        const temp = {}
        const date = daily.file.replace('collectionStats_', '').replace('.json', '')

        const blackBelts = daily.content.blackBeltOnly.blackBelts || {}
        Object.keys(blackBelts).forEach((userId) => {
            blackBelts[userId].acquired = acc['blackBelts'][userId]
            ? acc['blackBelts'][userId].acquired
            : date
        })
        acc.blackBelts = blackBelts

        cohorts.forEach(cohort => {
            const totalProfiles = daily.content[cohort].totalProfiles || 0
            const listUsers = daily.content[cohort].listUsers || 0
            const totalSaves = daily.content[cohort].totalSaves || 0
            const lockSaves = daily.content[cohort].lockSaves || 0
            const totalAwards = daily.content[cohort].importSummary?.totalAwards || 0
            const importUsers = daily.content[cohort].importSummary?.importUsers || 0
            const awardUsers = daily.content[cohort].importSummary?.awardUsers || 0
            const listStats = daily.content[cohort].listStats
                ? Object.keys(daily.content[cohort].listStats).map(listName => {
                    return {
                        listName,
                        userCount: daily.content[cohort].listStats[listName].userCount,
                        totalSaves: daily.content[cohort].listStats[listName].totalSaves
                    }
                })
                : []
            const newProfiles = acc.length > 0
                ? (totalProfiles || 0) - (acc[acc.length - 1][cohort].totalProfiles || 0)
                : totalProfiles || 0
            const newListUsers = acc.length > 0
                ? (listUsers || 0) - (acc[acc.length - 1][cohort].listUsers || 0)
                : listUsers || 0
            const newImportUsers = acc.length > 0
                ? (importUsers || 0) - (acc[acc.length - 1][cohort].importUsers || 0)
                : importUsers || 0

            temp[cohort] = {
                date, totalProfiles, listUsers, totalSaves,
                lockSaves, totalAwards, importUsers, awardUsers, listStats,
                newProfiles, newListUsers, newImportUsers
            }
        })
        temp.date = date
        setDeepPush(acc, ['dayData'], temp)
        acc.metadata = {updatedDateTime: new Date().toISOString()}

        return acc
    }, {})

    //jsonIt('dailyStats', dailyStats)

    await fs.writeFile(`${serverDir}/collectionStatsDaily.json`, JSON.stringify(dailyStats, null, 2), function (err) {
        if (err) {
            console.error('save collectionStatsDaily error:', err)
        }
    })

}

collectionStatsProcess().then()

async function readFilesInDirectory(directoryPath) {
    try {
        const files = (await fs.readdir(directoryPath)).filter(file => file.includes('collectionStats'))
        return await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(directoryPath, file)
                const content = await fs.readFile(filePath, 'utf8')
                return {file, content}
            })
        )
    } catch (err) {
        console.error('Error reading files:', err)
    }
}
