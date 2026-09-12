import {Router} from 'express'
import lazyMount from './util/lazyMount.js'
import health from './testing/health.js'
import ready from './testing/ready.js'
import boom from './testing/boom.js'
import echo from './testing/echoMessage.js'
import normalizeRequestUrl from './util/normalizeRequestUrl.js'
import api from './api/index.js'

export function registerRoutes(app, {
    prefix = '/services',
    requestLockHandlers,
    uploadContentHandler
} = {}) {
    const r = Router()

    r.use(normalizeRequestUrl)

    r.use(health)
    r.use(ready)
    r.use(echo)
    r.use(boom)
    app.use(prefix, r)

    // single slash path for lazy mount
    lazyMount(app, `${prefix}/flickr-info`, () => import('./projects/flickrGetInfo/getFlickrInfo.bundle.js'))
    lazyMount(app, `${prefix}/upload`, async () => {
        const module = await import('./projects/uploadContent/uploadContent.bundle.js')
        return {default: module.createUploadContentRouter(uploadContentHandler)}
    })
    lazyMount(app, `${prefix}/request-lock`, async () => {
        const module = await import('./projects/requestLock/requestLock.bundle.js')
        return {default: module.createRequestLockRouter(requestLockHandlers)}
    })
    lazyMount(app, `${prefix}/update-request`, async () => {
        const module = await import('./projects/requestLock/updateRequest.bundle.js')
        return {default: module.createUpdateRequestRouter(requestLockHandlers)}
    })
    lazyMount(app, `${prefix}/request-vote`, async () => {
        const module = await import('./projects/requestLock/requestVote.bundle.js')
        return {default: module.createRequestVoteRouter(requestLockHandlers)}
    })

    lazyMount(app, `${prefix}/fetch-reddit-flairs`, () => import('./projects/redditBelts/getRedditBelts.bundle.js'))
    // FOR LOCKY JR  ??????
    lazyMount(app, `${prefix}/fetch-flairs`, () => import('./projects/fetchFlairs/fetchFlairs.bundle.js'))

    //RAFL Data Import for preview mode
    lazyMount(app, `${prefix}/refresh-preview`, () => import('./projects/importRaflData/importRaflData.bundle.js'))

    lazyMount(app, `${prefix}/log-activity`, () => import('./projects/logFirebaseActivity/logFirebaseActivity.bundle.js'))
    lazyMount(app, `${prefix}/process-firebase-log`, () => import('./projects/logFirebaseActivity/processFirebaseActivityLog.bundle.js'))

    lazyMount(app, `${prefix}/email-form`, () => import('./projects/emailFormContents/emailFormContents.bundle.js'))
    app.use([`${prefix}/api`, `/${prefix}/api`], api)
}
