import { enqueueSnackbar } from 'notistack'
import { serverUrl } from './rankingRequestData'

export default async function postVoteUpdate({ entryId, user }) {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 10000)

    try {
        const idToken = await user.getIdToken()
        const rand = Math.floor(Math.random() * 1000000)
        const response = await fetch(`${serverUrl}/request-vote?${rand}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + idToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entryId }),
            signal: controller.signal, // Link the abort controller
        })

        clearTimeout(timeout)

        if (!response.ok) {
            let errorMessage = 'Error updating request'
            try {
                const errorData = await response.json()
                console.log('errorData', errorData)
                errorMessage = errorData.message || errorMessage
                enqueueSnackbar(`Error updating votes: ${errorMessage}`, { variant: 'error', autoHideDuration: 3000 })

            } catch (e) {
                // Fallback in case parsing fails
            }
            return { response: { data: { status: response.status, message: errorMessage } } }
        } else {
            enqueueSnackbar('Votes updated')
            return await response.json().catch(() => ({}))
        }
    } catch (error) {
        clearTimeout(timeout)
        console.error('Error during authentication or server request:', error)
        enqueueSnackbar('Error updating request', { variant: 'error', autoHideDuration: 3000 })
        throw error
    }
}
