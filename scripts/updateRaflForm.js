import fetch from 'node-fetch'

import {apiServerUrl} from '../src/data/dataUrls.js'
const url = `${apiServerUrl}/update-rafl-form`

const refreshResults = await (await fetch(url)).json()

console.log('Update Raffle Form Results:', refreshResults)