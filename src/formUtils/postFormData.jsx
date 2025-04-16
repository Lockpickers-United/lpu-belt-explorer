import axios from 'axios'
import {enqueueSnackbar} from 'notistack'

export const postFormData = async ({user, url, formData, snackBars}) => {

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 10000)
    const rand = Math.floor(Math.random() * 100000)

    const idToken = user ? await user.getIdToken() : null

    const headers = idToken
        ? {
            'Authorization': 'Bearer ' + idToken,
            'Content-Type': 'multipart/form-data'
        }
        : {
            'Content-Type': 'multipart/form-data'
        }

    try {
        // Await the axios.post call, which returns the response.
        const response = await axios.post(
            `${url}?${rand}`,
            formData,
            {
                headers,
                signal: controller.signal // Link the abort controller
            }
        )

        clearTimeout(timeout)
        if (snackBars) {
            enqueueSnackbar('Upload successful', {variant: 'success'})
        }
        // Return the data property of the response.
        return response.data

    } catch (error) {
        clearTimeout(timeout)
        console.error('Error during authentication or server request:', cleanError(error))
        if (snackBars) {
            enqueueSnackbar('Error during authentication or server request', {variant: 'error', autoHideDuration: 3000})
        }
        throw new Error(cleanError(error))
    }
}

const cleanError = (error) => {
    if (error.response?.data && typeof error.response.data === 'string') {
        const errorStatus = error.message.match(/code (\d+)/)?.[1]
        const errorText = error.response.data.match(/<pre>([\s\S]*?)<\/pre>/)?.[1]
        return {response: {data: {status: errorStatus, message: errorText}}}
    } else {
        return error
    }
}
