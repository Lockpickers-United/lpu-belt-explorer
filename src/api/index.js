import {Router} from 'express'
import users from './routes/users.js'
import collections from './routes/collections.js'
import locks from './routes/locks.js'

const router = Router()
const v1 = Router()

v1.use('/users', users)
v1.use('/locks', locks)
v1.use('/stats/collections', collections)
router.use('/v1', v1)

export default router
