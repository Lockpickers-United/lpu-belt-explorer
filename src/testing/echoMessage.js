import {z} from 'zod'
import { Router } from 'express'

const router = Router()

router.post('/echo', (req, res) => echoMessage(req, res))

export async function echoMessage(req, res) {
    const schema = z.object({message: z.string().min(1)})
    const parsed = schema.safeParse(req.body)
    const {prod} = req.body
    if (!parsed.success) {
        return res.status(400).json({error: 'invalid_body', issues: parsed.error.issues})
    }
    return res.json({echo: parsed.data.message + (prod ? ' (PROD)' : ' (DEV)')})
}

export default router
