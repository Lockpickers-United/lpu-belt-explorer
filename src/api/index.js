import {Router} from 'express'
import users from './routes/users.js'
import collections from './routes/collections.js'
import locks from './routes/locks.js'
import classification from './routes/classification.js'
import discordIdentity from './routes/discordIdentity.js'
import discordBeltRequests from './routes/discordBeltRequests.js'

const router = Router()
const v1 = Router()

v1.use('/users', users)
v1.use('/locks', locks)
v1.use('/stats/collections', collections)
v1.use('/classification', classification)
v1.use('/discord', discordIdentity)
v1.use('/belt-requests', discordBeltRequests)
router.use('/v1', v1)

export default router
