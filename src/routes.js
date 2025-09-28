import { Router } from 'express'
import lazyMount from './util/lazyMount.js'
import health from './testing/health.js'
import ready from './testing/ready.js'
import boom from './testing/boom.js'
import echo from './testing/echoMessage.js'

export function registerRoutes(app, { prefix = '/services' } = {}) {

    const r = Router()

    // Normalize slashes inside the mounted router as well (handles cases where the remainder after prefix has //)
    r.use((req, _res, next) => {
        if (typeof req.url === 'string' && req.url.includes('//')) {
            req.url = req.url.replace(/\/{2,}/g, '/')
        }
        next()
    })

    r.use(health)
    r.use(ready)
    r.use(echo)
    r.use(boom)
    app.use(prefix, r)

    // single slash path for lazy mount
    lazyMount(app, `${prefix}/flickr-info`, () => import('./projects/flickrGetInfo/getFlickrInfo.bundle.js'))
    lazyMount(app, `${prefix}/upload`, () => import('./projects/uploadContent/uploadContent.bundle.js'))
    lazyMount(app, `${prefix}/request-lock`, () => import('./projects/requestLock/requestLock.bundle.js'))
    lazyMount(app, `${prefix}/update-request`, () => import('./projects/requestLock/updateRequest.bundle.js'))
    lazyMount(app, `${prefix}/request-vote`, () => import('./projects/requestLock/requestVote.bundle.js'))

    lazyMount(app, `${prefix}/fetch-reddit-flairs`, () => import('./projects/redditBelts/getRedditBelts.bundle.js'))
    // FOR LOCKY JR  ??????
    lazyMount(app, `${prefix}/fetch-flairs`, () => import('./projects/fetchFlairs/fetchFlairs.bundle.js'))

    lazyMount(app, `${prefix}/refresh-preview`, () => import('./projects/importRaflData/importRaflData.bundle.js'))

    lazyMount(app, `${prefix}/log-activity`, () => import('./projects/logFirebaseActivity/logFirebaseActivity.bundle.js'))
    lazyMount(app, `${prefix}/process-firebase-log`, () => import('./projects/logFirebaseActivity/processFirebaseActivityLog.bundle.js'))

}