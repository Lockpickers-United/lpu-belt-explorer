import fetch from 'node-fetch'
const url = 'http' + '://explore.lpubelts.com:8080/refresh-preview'
const refreshResults = await (await fetch(url)).json()

console.log('Refresh Raffle Preview Results:', refreshResults)