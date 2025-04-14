import { serverUrl } from './rankingRequestData'

export default async function postFirebaseActivity({ activityData }) {

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 10000)
    const rand = Math.floor(Math.random() * 1000000)

    try {
        const response = await fetch(`${serverUrl}/log-activity?${rand}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ activityData }),
            signal: controller.signal, // Link the abort controller
        })

        clearTimeout(timeout)

        if (!response.ok) {
            let errorMessage = 'Error updating request'
            try {
                const errorData = await response.json()
                console.error('errorData', errorData)
                errorMessage = errorData.message || errorMessage
            } catch (e) {
                // Fallback in case parsing fails
            }
            return { response: { data: { status: response.status, message: errorMessage } } }
        } else {
            return await response.json().catch(() => ({}))
        }
    } catch (error) {
        clearTimeout(timeout)
        console.error('Error during authentication or server request:', error)
        throw error
    }
}
