import fetch from 'node-fetch'
const url = 'https://explore.lpubelts.com/services/refresh-preview'
const refreshResults = await (await fetch(url)).json()

console.log('Refresh Raffle Preview Results:', refreshResults)