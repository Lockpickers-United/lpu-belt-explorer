import {enqueueSnackbar} from 'notistack'

export default async function postRequestUpdate({ entry, user, serverUrl }) {
    try {
        const idToken = await user.getIdToken()
        const response = await fetch(`${serverUrl}/update-request`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + idToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entry })
        })
        const data = await response.json()
        console.log('Server response:', data)
        if (response.status !== 200) {
            enqueueSnackbar('Error updating request status', {variant: 'error'})
        } else {
            enqueueSnackbar('Request status updated')
        }
        return response
    } catch (error) {
        console.error('Error during authentication or server request:', error)
        return Promise.reject(error)
    }
}
