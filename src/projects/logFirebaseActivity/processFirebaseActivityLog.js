import {localUser, prodUser} from '../../../keys/users.js'
import fs from 'fs'
import dayjs from 'dayjs'
import {setDeepAdd} from '../../util/setDeep.js'

const local = process.env.USER === localUser
const logsDir = local
    ? `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node/projects/logFirebaseActivity`
    : `/home/${prodUser}/local-logs`
const logFile = `${logsDir}/firebase.log`

const startDate = dayjs('2025-04-15 00:00:00 -0700')

// ONLY FOR LOCAL TESTING
if (local) {
    //await processFirebaseActivityLog().then()
}

export default async function processFirebaseActivityLog(req, res) {

    let entries = []
    try {
        entries = await parseLogFile(logFile)
        //   { timestamp: dayjs(2025-04-17T15:23:00.000Z), action: 'READ', docCount: 5, source: 'API', id: 'abc123', displayName: 'John Doe' },
    } catch (err) {
        console.error('Failed to parse log file:', err)
        res.status(500).send({'error': 'Failed to parse log file'})
    }
    const logInfo = entries
        .reduce((acc, entry) => {
            if (['READ', 'WRITE'].includes(entry.action)) {
                setDeepAdd(acc, ['dailyTotals', entry.timestamp.format('YYYY-MM-DD'), entry.action], entry.docCount)
                setDeepAdd(acc, ['bySource', entry.timestamp.format('YYYY-MM-DD'), entry.source], entry.docCount)
                setDeepAdd(acc, ['hourly', entry.timestamp.format('HH'), entry.source], entry.docCount)
            }
            if (entry.source === 'request-subscription') {
                setDeepAdd(acc, ['requestSubscriptions', entry.timestamp.format('YYYY-MM-DD'), entry.action], entry.docCount)
            }
            return acc
        }, {})

    console.log('logInfo', logInfo)

    return logInfo

}


/**
 * Parse a single CSV log line into an object.
 * @param {string} line
 * @returns {{ timestamp: dayjs.Dayjs, action: string, docCount: number, source: string, id: string, displayName: string }}
 */
function parseLine(line) {
    // split into at most 6 parts, so displayName can contain commas
    const [timestamp, action, docCountStr, source, id, ...displayNameParts] = line.split(',')
    return {
        timestamp: dayjs(timestamp.trim()),
        action:    action.trim(),
        docCount:  Number(docCountStr.trim()),
        source:    source.trim(),
        id:        id.trim(),
        displayName: displayNameParts.join(',').trim()
    }
}



/**
 * Asynchronously read and parse a CSV‑style log file.
 * @param {string} filePath
 * @returns {Promise<Array>}
 */
async function parseLogFile(filePath) {
    const text = await fs.promises.readFile(filePath, 'utf8')
    return text
        .split(/\r?\n/)
        .filter(line => !line.startsWith('#'))
        .filter(line => line.trim().length > 0)
        .map(parseLine)
        .filter(entry => entry.timestamp.isAfter(startDate))
}
