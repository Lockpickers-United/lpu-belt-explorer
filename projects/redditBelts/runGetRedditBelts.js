import getRedditBelts from './getRedditBelts.js'

async function runGetRedditBelts() {
    try {
        await getRedditBelts()
    } catch (error) {
        console.error('Error running getRedditBelts:', error)
    }
}
await runGetRedditBelts().then()