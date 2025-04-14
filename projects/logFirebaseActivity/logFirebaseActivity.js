/**
 * @prop newBrand
 */

import fs from 'fs'
import {prodUser} from '../../keys/users.js'
import dayjs from 'dayjs'


const logsDir = `/home/${prodUser}/local-logs`

function handleError(res, message, error, status = 500) {
    console.error(message, error)
    res.status(status).send({status, message})
}

export default async function logFirebaseActivity(req, res) {
    const { activityData } = req.body;
    console.log('activityData', activityData);

    try {
        await logToFirebaseLog(activityData)
    } catch (err) {
        return handleError(res, 'Error logging activity', null, 500);
    }

    console.log('done');
    return res.status(200).json('Activity Logged');
}

////////////

export async function logToFirebaseLog(messages) {
    if (!Array.isArray(messages)) {
        messages = [messages]
    }

    console.log('messages', messages)

    const TestMessages = [
        {
            activity: 'WRITE',
            activityCount: 1,
            source: 'request-create',
            id: '13be6f81',
            displayName: 'mgsecure'
        }
    ]

    try {
        await Promise.all(
            messages?.map(async (message) => {
                const { activity, activityCount, source, id, displayName } = message
                const logMessage = `${dayjs().toISOString()},${[activity, activityCount, source, id, displayName].join(',')}\n`
                try {
                    await fs.promises.appendFile(`${logsDir}/firebase.log`, logMessage)
                    return logMessage
                } catch (err) {
                    console.error('Error writing to log file:', err)
                    return err
                }
            })
        );
    } catch (err) {
        console.log('Logging Error', err)
    }

}
