import {raflUtils} from './raflFormUtils.js'

export default async function updateRaflData() {

    try {

        await raflUtils('raflResponseSummary').then(results => {
            if (results.status === 'error') console.log('error', results)
        })

        await raflUtils('processResponses').then(results => {
            if (results.status === 'error') console.log('error', results)
        })

    } catch (err) {
        console.log('err', err)
    }
}

await updateRaflData()