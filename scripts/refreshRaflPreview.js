import fetch from 'node-fetch'

const url = process.env.USER !== 'testing'
    ? 'http' + '://explore.lpubelts.com:8080/refresh-preview'
    : 'https://explore.lpubelts.com:8443/refresh-preview'

const refreshResults = await (await fetch(url)).json()

console.log('Refresh Raffle Preview Results:', refreshResults)