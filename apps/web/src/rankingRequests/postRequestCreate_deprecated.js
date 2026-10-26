import {enqueueSnackbar} from 'notistack'
import {nodeServerUrl} from '../data/dataUrls'
import axios from 'axios'

export default async function postRequestCreate_deprecated({formData, user, setUploadError}) {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 15000)
    const rand = Math.floor(Math.random() * 1000000)

    try {
        const idToken = await user.getIdToken()
        const response = await axios.post(
            `${nodeServerUrl}/request-lock?${rand}`, formData,
            {
                headers: {
                    'Authorization': 'Bearer ' + idToken,
                    'Content-Type': 'multipart/form-data'
                },
                signal: controller.signal // Link the abort controller
            }
        )

        clearTimeout(timeout)

        if (!response.ok) {
            let errorMessage = 'Error creating request'
            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorMessage
                enqueueSnackbar(`Error creating request: ${errorMessage}`, {variant: 'error', autoHideDuration: 3000})
            } catch (_e) {
                // Fallback in case parsing fails
            }
            return {response: {data: {status: response.status, message: errorMessage}}}
        } else {
            enqueueSnackbar('Votes updated')
            return await response.json().catch(() => ({}))
        }
    } catch (error) {
        clearTimeout(timeout)
        console.error('Error during authentication or server request:', cleanError(error))
        enqueueSnackbar('Error creating request', {variant: 'error', autoHideDuration: 3000})
        setUploadError(cleanError(error))
        throw error
    }
}

const cleanError = (error) => {
    if (error.response.data && typeof error.response.data === 'string') {
        const errorStatus = error.message.match(/code (\d+)/)[1]
        const errorText = error.response.data.match(/<pre>([\s\S]*?)<\/pre>/)[1]
        return {response: {data: {status: errorStatus, message: errorText}}}
    } else {
        return error
    }
}