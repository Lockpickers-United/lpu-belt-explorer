import {enqueueSnackbar} from 'notistack'
import {nodeServerUrl} from '../data/dataUrls'

export default async function postRequestUpdate_deprecated({entry, user}) {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 15000)
    const rand = Math.floor(Math.random() * 1000000)

    try {
        const idToken = await user.getIdToken()
        const response = await fetch(`${nodeServerUrl}/update-request?${rand}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + idToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({entry}),
            signal: controller.signal, // Link the abort controller
        })

        clearTimeout(timeout)

        if (!response.ok) {
            let errorMessage = 'Error updating request'
            try {
                const errorData = await response.json()
                console.log('errorData', errorData)
                errorMessage = errorData.message || errorMessage
                enqueueSnackbar(`Error updating request: ${errorMessage}`, { variant: 'error', autoHideDuration: 3000 })

            } catch (_e) {
                // Fallback in case parsing fails
            }
            return { response: { data: { status: response.status, message: errorMessage } } }
        } else {
            enqueueSnackbar('Request updated')
            return await response.json().catch(() => ({}))
        }
    } catch (error) {
        clearTimeout(timeout)
        console.error('Error during authentication or server request:', cleanError(error))
        enqueueSnackbar('Error updating request', { variant: 'error', autoHideDuration: 3000 })
        throw error
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