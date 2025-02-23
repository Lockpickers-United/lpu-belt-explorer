import fetch from 'node-fetch'
const url = 'http' + '://explore.lpubelts.com:8080/update-rafl-form'
const refreshResults = await (await fetch(url)).json()

console.log('Update Raffle Form Results:', refreshResults)