import { serverUrl } from './rankingRequestData'
import {cleanError, postData} from '../formUtils/postData.jsx'

export default async function postFirebaseActivity({ activityData }) {

    const url = `${serverUrl}/log-activity`
    const snackBars = false
    const json= JSON.stringify({ activityData })

    try {
        return await postData({url, json, snackBars})
    } catch (error) {
        console.error(cleanError(error))
        throw error
    }

}
