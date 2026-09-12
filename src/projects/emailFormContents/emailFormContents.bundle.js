import {Router} from 'express'

export function createEmailFormRouter(emailFormHandler) {
    const router = Router()

    router.get('/', (req, res) => {
        req.log.info('Email Form route hit')
        res.json({message: 'Email Form endpoint', requestId: req.id})
    })

    router.post('/', async (req, res, next) => {
        try {
            const handler = emailFormHandler
                ?? (await import('./emailFormContents.js')).default
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createEmailFormRouter()
