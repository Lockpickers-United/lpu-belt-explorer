import {nodeServerUrl} from '../data/dataUrls'
import {cleanError, postData} from '../formUtils/postData.jsx'

export default async function postFirebaseActivity({ activityData }) {

    if (import.meta.env.DEV) return null

    const url = `${nodeServerUrl}/log-activity`
    const snackBars = false
    const json= JSON.stringify({ activityData })

    try {
        return await postData({url, json, snackBars})
    } catch (error) {
        console.error(cleanError(error))
        throw error
    }

}
