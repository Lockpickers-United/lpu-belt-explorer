import {enqueueSnackbar} from 'notistack'
import {serverUrl} from './rankingRequestData'

export default async function postRequestUpdate({entry, user}) {
    try {
        const idToken = await user.getIdToken()
        return await fetch(`${serverUrl}/update-request`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + idToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({entry})
        })
            .then(response => {
                //console.log('response', response)
                if (response.status !== 200) {
                    enqueueSnackbar('Error updating request status', {variant: 'error', autoHideDuration: 3000})
                    return {response: {data: {status: 500, message: 'Error updating request'}}}
                } else {
                    enqueueSnackbar('Request updated', {autoHideDuration: 3000})
                    return response
                }
            })
            .catch(error => {
                console.error('Error updating request:', cleanError(error))
            })
    } catch (error) {
        console.error('Error during authentication or server request:', error)
        return Promise.reject(error)
    }
}

const cleanError = (error) => {
    console.log(error)
    if (error.response.data && typeof error.response.data === 'string') {
        const errorStatus = error.message.match(/code (\d+)/)[1]
        const errorText = error.response.data.match(/<pre>([\s\S]*?)<\/pre>/)[1]
        return {response: {data: {status: errorStatus, message: errorText}}}
    } else {
        return error
    }
}