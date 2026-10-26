// thumbnail-worker.js
import createThumbnails from './createThumbnails.js'

process.on('message', async (opts) => {
    try {
        const result = await createThumbnails(opts)
        process.send({ result })
    } catch (err) {
        process.send({ error: err.message })
    } finally {
        // ensure we free everything
        process.exit(0)
    }
})
