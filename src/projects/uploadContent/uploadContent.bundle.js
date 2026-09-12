import {Router} from 'express'

export function createUploadContentRouter(uploadContentHandler) {
    const router = Router()

    router.get('/', (req, res) => {
        req.log.info('Upload Content route hit')
        res.json({message: 'Upload Content endpoint', requestId: req.id})
    })

    router.post('/', async (req, res, next) => {
        try {
            const uploadContent = uploadContentHandler
                ?? (await import('./uploadContent.js')).default
            await uploadContent(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createUploadContentRouter()
