import axios from 'axios'

// Helper to append a cache-busting value without duplicating '?' and preserving any hash fragment
const appendCacheBuster = (url, rand) => {
    const [base, hash] = url.split('#')
    const sep = base.includes('?') ? '&' : '?'
    return `${base}${sep}${rand}${hash ? '#' + hash : ''}`
}

export const getData = async ({user, url, formData, json, timeoutDuration = 15000, cacheBust=true}) => {

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, timeoutDuration)
    const rand = Math.floor(Math.random() * 1000000)

    const isJson = json !== undefined && formData === undefined

    const idToken = user ? await user.getIdToken() : null
    const headers = idToken
        ? {
            ...(idToken && {Authorization: `Bearer ${idToken}`})
            // No Content-Type for GET
        }
        : {}

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

    const urlWithParams = cacheBust
        ? appendCacheBuster(url, rand)
        : url

    try {
        // Use GET and pass params; cache-bust with rand
        const response = await axios.get(
            urlWithParams,
            {
                headers,
                signal: controller.signal, // Link the abort controller
                params
            }
        )

        clearTimeout(timeout)
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
