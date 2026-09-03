import {Router} from 'express'
import users from './routes/users.js'
import collections from './routes/collections.js'

const router = Router()
const v1 = Router()

v1.use('/users', users)
v1.use('/stats/collections', collections)
router.use('/v1', v1)

export default router
