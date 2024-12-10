import fetch from 'node-fetch'

console.log('env', process.env)

const url = process.env.USER === 'nealbayless'
    ? 'http' + '://explore.lpubelts.com:8080/refresh-preview'
    : 'https://explore.lpubelts.com:8443/refresh-preview'

const refreshResults = await (await fetch(url)).json()

console.log('Refresh Raffle Preview Results:', refreshResults)