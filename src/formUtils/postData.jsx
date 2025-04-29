import axios from 'axios'
import {enqueueSnackbar} from 'notistack'

export const postData = async ({user, url, formData, json, snackBars, timeoutDuration = 15000}) => {

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, timeoutDuration)
    const rand = Math.floor(Math.random() * 1000000)

    const idToken = user ? await user.getIdToken() : null
    const isJson = json !== undefined && formData === undefined
    const headers = {
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
        'Content-Type': isJson ? 'application/json' : 'multipart/form-data'
    }
    const data = isJson ? json : formData

    try {
        // Await the axios.post call, which returns the response.
        const response = await axios.post(
            `${url}?${rand}`,
            data,
            {
                headers, signal: controller.signal // Link the abort controller
            }
        )

        clearTimeout(timeout)
        if (snackBars) {
            enqueueSnackbar('Request successful', {variant: 'success'})
        }
        // Return the data property of the response.
        return response.data

    } catch (error) {
        clearTimeout(timeout)

        const isTimeout =
            error.name === 'CanceledError' ||
            error.code === 'ERR_CANCELED' ||
            error.message?.includes('aborted')

        if (snackBars) {
            enqueueSnackbar(
                isTimeout
                    ? 'Request timed out. Please try again.'
                    : 'Error during authentication or server request',
                {
                    variant: 'error',
                    autoHideDuration: isTimeout ? 5000 : 3000
                }
            )
        }

        if (isTimeout) {
            throw new Error('Request timed out')
        }

        console.error('Error during authentication or server request:', cleanError(error))
        throw new Error('Error during authentication or server request')
    }
}

export const cleanError = (error) => {
    if (error.response?.data && typeof error.response.data === 'string') {
        const errorStatus = error.message.match(/code (\d+)/)?.[1]
        const errorText = error.response.data.match(/<pre>([\s\S]*?)<\/pre>/)?.[1]
        return {response: {data: {status: errorStatus, message: errorText}}}
    } else {
        return error
    }
}
