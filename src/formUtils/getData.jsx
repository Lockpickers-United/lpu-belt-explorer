import axios from 'axios'
import {enqueueSnackbar} from 'notistack'

// Helper to append a cache-busting value without duplicating '?' and preserving any hash fragment
const appendCacheBuster = (url, rand) => {
    const [base, hash] = url.split('#')
    const sep = base.includes('?') ? '&' : '?'
    return `${base}${sep}${rand}${hash ? '#' + hash : ''}`
}

export const getData = async ({user, url, formData, json, snackBars, timeoutDuration = 15000}) => {

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, timeoutDuration)
    const rand = Math.floor(Math.random() * 1000000)

    const idToken = user ? await user.getIdToken() : null
    const isJson = json !== undefined && formData === undefined
    const headers = {
        ...(idToken && {Authorization: `Bearer ${idToken}`})
        // No Content-Type for GET
    }

    // For GET, send data as query params (prefer json; fallback to formData)
    const baseData = isJson ? json : formData
    let params = baseData
    try {
        if (typeof FormData !== 'undefined' && baseData instanceof FormData) {
            params = Object.fromEntries(baseData.entries())
        }
    } catch (_) {
        // ignore detection issues; leave params as-is
    }

    try {
        // Use GET and pass params; cache-bust with rand
        const response = await axios.get(
            appendCacheBuster(url, rand),
            {
                headers,
                signal: controller.signal, // Link the abort controller
                params
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
        const errorMessage = isTimeout
            ? 'Request timed out. Please try again.'
            : error.response?.data?.error?.message
            || error.response?.data?.message
            || error.message
            || 'Error during authentication or server request'

        if (snackBars) {
            enqueueSnackbar(
                `${errorMessage} (${error.status})`,
                {
                    variant: 'error',
                    autoHideDuration: isTimeout ? 5000 : 3000
                }
            )
        }
        throw {...error, message: errorMessage}
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
