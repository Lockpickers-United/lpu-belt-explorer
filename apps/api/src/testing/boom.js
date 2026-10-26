import { Router } from 'express'
import { asyncHandler } from '../util/asyncHandler.js'

const router = Router()

router.get('/boom', asyncHandler(async (_req, _res) => {
  await new Promise(r => setTimeout(r, 10))
  throw new Error('kaboom')
}))

export default router
