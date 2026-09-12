import fetch from 'node-fetch'

const url = 'https://explore.lpubelts.com/services/refresh-preview'
const idToken = process.env.RAFL_ADMIN_ID_TOKEN?.trim()
if (!idToken) throw new Error('RAFL_ADMIN_ID_TOKEN is required')

const response = await fetch(url, {
    headers: {Authorization: `Bearer ${idToken}`}
})
const refreshResults = await response.json()
if (!response.ok) {
    throw new Error(`RAFL preview refresh failed (${response.status}): ${JSON.stringify(refreshResults)}`)
}

console.log('Refresh Raffle Preview Results:', refreshResults)
