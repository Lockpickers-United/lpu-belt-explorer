/**
 * @prop foobar
 */
import {logger} from '../../logger/logger.js'

const log = logger.child({
    module: 'logFirebaseActivity'
})

function handleError(res, message, error, status = 500) {
    error.length && log.error({err: error}, message)
    res.status(status).send({status, message})
}

export default async function handleFirebaseActivityPost(req, res) {
    // TODO fix??
    const {activityData, prod} = req.body
    const mappedActivity = activityData.map((activityItem) => {
        const {activity, activityCount, source, id, displayName} = activityItem
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
        log.error({err}, 'Error logging activity')
        return handleError(res, 'Error logging activity', null, 500)
    }
    return res.status(200).json('Activity Logged')
}

export async function logToFirebaseLog(messages) {
    if (!Array.isArray(messages)) {
        messages = [messages]
    }

    try {
        messages?.map(async (message) => {
            const {activity, activityCount, source, id, displayName, prod} = message
            const envString = prod ? 'prod' : 'dev'

            log.info({activity, activityCount, source, id, displayName}, envString)
        })

    } catch (err) {
        log.error({err}, 'General Logging Error')
    }

}
