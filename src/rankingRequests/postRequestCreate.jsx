import {enqueueSnackbar} from 'notistack'
import {serverUrl} from './rankingRequestData'
import axios from 'axios'

export default async function postRequestCreate({formData, user, setUploadError}) {

    try {
        const idToken = await user.getIdToken()

        return await axios.post(
            `${serverUrl}/request-lock`, formData,
            {
                headers: {
                    'Authorization': 'Bearer ' + idToken,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
            .then(response => {
                //console.log('response.data', response.data)
                if (response.status !== 200) {
                    enqueueSnackbar('Error updating request status', {variant: 'error'})
                    return {response: {data: {status: 500, message: 'Error updating request status'}}}
                } else {
                    enqueueSnackbar('Request submitted')
                    return response
                }
            })
            .catch(error => {
                console.error('Error updating request status:', cleanError(error))
                setUploadError(cleanError(error))
            })

    } catch (error) {
        console.error('Error during authentication or server request:', cleanError(error))
        setUploadError(cleanError(error))
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