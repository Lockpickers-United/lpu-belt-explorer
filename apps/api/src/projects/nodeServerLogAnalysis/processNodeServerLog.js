import dayjs from 'dayjs'

import {glob, open} from 'node:fs/promises'

import {setDeepAdd} from '../../util/setDeep.js'
import {loadDeprecatedKeysModule} from '../../util/deprecatedKeys.js'

const {localUser, prodUser} = await loadDeprecatedKeysModule('users.js')

const local = process.env.USER === localUser
const logsDir = local
    ? `/Users/${localUser}/LOCAL/PROJECTS/firebase server API/logs-local`
    : `/home/${prodUser}/logs-local`

const _startDate = dayjs('2025-04-15 00:00:00 -0700')
const logFiles = await glob(`${logsDir}/exploreLPUbeltsServer-out.log`)

let logEntries = {}
let logData = {}

const ignoreFields = ['requestId', 'ip', 'archiveStatus', 'emailStatus', 'tempDirectory']

for await (const filePath of logFiles) {
    const content = await open(filePath)
    for await (const line of content.readLines()) {
        if (line.toString().startsWith('{')) {
            const json = JSON.parse(line)
            const {time, ...otherfields} = json
            const date = time ? dayjs(time).format('YYYY-MM-DD') : 'unknown'

            if (json.level && json.level === 30) {

                if (json.module === 'firebase-activity') {
                    const {type, count, source, prod} = json
                    const env = prod ? 'prod' : 'dev'
                    setDeepAdd(logData, [date, 'firebase-activity', env, 'totals', type], count)
                    setDeepAdd(logData, [date, 'firebase-activity', env, source, type], count)
                } else if (json.module === 'api.routes.users') {
                    const {endpoint, msg, userId, displayName} = json
                    setDeepAdd(logData, [date, 'api', 'users', msg, endpoint, `${displayName}||${userId}`], 1)
                } else if (json.module === 'api.routes.stats.collections') {
                    const {endpoint, msg} = json
                    setDeepAdd(logData, [date, 'api', 'collections', msg, endpoint], 1)
                }


// {"level":30,"time":"2026/09/10 15:52:08.161",
// "module":"api.routes.users","requestId":"af0d52e6-76ca-4d50-9067-d6826ef0c76b",
// "endpoint":"GET /api/v1/users/:id/summary",
// "userId":"1SqcRKce18boUZBtOHWSenGAI202",
// "displayName":"Zehkar",
// "ip":"172.58.144.87",
// "msg":"user summary served"}


                Object.entries(otherfields).map(([field, value]) => {
                    if (typeof value !== 'object' && !ignoreFields.includes(field)) {
                        setDeepAdd(logEntries, [field, value], 1)
                    }
                }, {})
            }
        }
    }
}

console.log('logData', JSON.stringify(logData, null, 2))
//console.log('logEntries', logEntries)


export default async function processNodeServerLog() {

}

