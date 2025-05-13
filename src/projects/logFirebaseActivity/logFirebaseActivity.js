/**
 * @prop foobar
 */

import fs from 'fs'
import {prodUser} from '../../../keys/users.js'
import dayjs from 'dayjs'

const logsDir = `/home/${prodUser}/local-logs`

function handleError(res, message, error, status = 500) {
    console.error(message, error)
    res.status(status).send({status, message})
}

export default async function handleFirebaseActivityPost(req, res) {
    // TODO fix??
    const { activityData, prod } = req.body
    const mappedActivity = activityData.map((activityItem) => {
        const { activity, activityCount, source, id, displayName } = activityItem
        return {
            activity,
            activityCount,
            source,
            id,
            displayName,
            prod
        }
    })
    try {
        await logToFirebaseLog(mappedActivity, prod)
    } catch (err) {
        console.error('Error logging activity', err)
        return handleError(res, 'Error logging activity', null, 500)
    }
    console.log('handleFirebaseActivityPost done')
    return res.status(200).json('Activity Logged')
}

export async function logToFirebaseLog(messages) {
    if (!Array.isArray(messages)) {
        messages = [messages]
    }

    try {
        await Promise.all(
            messages?.map(async (message) => {
                const { activity, activityCount, source, id, displayName, prod } = message
                const envString = prod ? '' : ',dev'
                const logMessage = `${dayjs().format('YYYY-MM-DD HH:mm:ss ZZ')},${[activity, activityCount, source, id, displayName].join(',')}${envString}\n`
                try {
                    await fs.promises.appendFile(`${logsDir}/firebase.log`, logMessage)
                    return logMessage
                } catch (err) {
                    console.error('Error writing to log file:', err)
                    return err
                }
            })
        )
    } catch (err) {
        console.log('Logging Error', err)
    }

}
