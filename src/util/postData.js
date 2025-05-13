import axios from 'axios'
import https from 'https'

export const postData = async ({user, url, formData, json, timeoutDuration = 10000}) => {

    const temp = user // eslint-disable-line no-unused-vars

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, timeoutDuration)
    const rand = Math.floor(Math.random() * 1000000)

    const isJson = json !== undefined && formData === undefined
    const headers = {
        'Content-Type': isJson ? 'application/json' : 'multipart/form-data'
    }
    const data = isJson ? json : formData

    try {
        // Await the axios.post call, which returns the response.
        const response = await axios.post(
            `${url}?${rand}`,
            data,
            {
                headers, signal: controller.signal, // Link the abort controller
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            }
        )

        clearTimeout(timeout)
        // Return the data property of the response.
        return response.data

    } catch (error) {
        clearTimeout(timeout)
        console.error('Error during authentication or server request:', cleanError(error))
        throw error
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
