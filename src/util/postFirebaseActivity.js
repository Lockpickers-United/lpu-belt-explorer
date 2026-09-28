import {loadDeprecatedKeysModule} from './deprecatedKeys.js'
import {cleanError, postData} from './postData.js'

const {nodeServerUrl} = await loadDeprecatedKeysModule('nodeServerUrls.js')

export default async function postFirebaseActivity({activityData}) {

    const url = `${nodeServerUrl}/log-activity`
    const json= JSON.stringify({activityData})

    try {
        return await postData({url, json})
    } catch (error) {
        console.error(cleanError(error))
        throw error
    }

}
