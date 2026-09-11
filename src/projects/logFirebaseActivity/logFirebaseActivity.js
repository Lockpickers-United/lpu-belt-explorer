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
    const messages = (!Array.isArray(activityData))
        ? [activityData]
        : activityData
    const mappedMessages = messages
        .filter((message) => message.count > 0 || message.type === 'REFRESH')
        .map((message) => {
            const {type, activity, activityCount} = message

            if (activityCount) log.error('logFirebaseActivity.js : activityCount is present')

            const mappedMessage = {
                ...message,
                type: type || activity,
                prod
            }
            return Object.fromEntries(
                Object.entries(mappedMessage)
                    .filter(([_key, value]) => value !== null && value !== '' && true)
            )
        })
    try {
        await logFirebaseActivity(mappedMessages, prod)
    } catch (err) {
        log.error({err}, 'logFirebaseActivity Error')
        return handleError(res, 'Error logging activity', null, 500)
    }
    return res.status(200).json('Activity Logged')
}

export async function logFirebaseActivity(messages) {
    try {
        messages?.map(async (message) => {
            log.info(message, 'firebase accessed')
        })

    } catch (err) {
        log.error({err}, 'logFirebaseActivity Error')
    }

}
