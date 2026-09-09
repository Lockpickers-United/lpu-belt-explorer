import {logger} from '../../logger/logger.js'

const log = logger.child({
    module: 'firebase-activity'
})

function handleError(res, message, error, status = 500) {
    error.length && log.error({err: error}, message)
    res.status(status).send({status, message})
}

export default async function handleFirebaseActivityPost(req, res) {
    // TODO fix??
    const {activityData, prod} = req.body
    const mappedActivity = activityData.map((activityItem) => {
        const {type, count, activity, activityCount, source, id, displayName} = activityItem
        return {
            type: type ||activity,
            count: count || activityCount,
            source,
            id,
            displayName,
            prod
        }
    })
    try {
        await logFirebaseActivity(mappedActivity, prod)
    } catch (err) {
        log.error({err}, 'logFirebaseActivity Error')
        return handleError(res, 'Error logging activity', null, 500)
    }
    return res.status(200).json('Activity Logged')
}

export async function logFirebaseActivity(messages) {
    if (!Array.isArray(messages)) {
        messages = [messages]
    }

    try {
        messages?.map(async (message) => {
            const {type, count, source, id, displayName, prod} = message
            log.info({type, count, source, id, displayName, prod}, 'firebase accessed')
        })

    } catch (err) {
        log.error({err}, 'logFirebaseActivity Error')
    }

}
