import {Router} from 'express'
import lazyMount from './util/lazyMount.js'
import health from './testing/health.js'
import ready from './testing/ready.js'
import boom from './testing/boom.js'
import echo from './testing/echoMessage.js'
import normalizeRequestUrl from './util/normalizeRequestUrl.js'
import api from './api/index.js'

export function shouldEnableDiagnosticRoutes(environment = process.env.NODE_ENV) {
    return environment !== 'production'
}

export function registerRoutes(app, {
    prefix = '/services',
    requestLockHandlers,
    uploadContentHandler,
    emailFormHandler,
    importRaflDataHandler,
    getRedditBeltsHandler,
    getFlickrInfoHandler,
    firebaseActivityHandler,
    enableDiagnosticRoutes = shouldEnableDiagnosticRoutes()
} = {}) {
    const r = Router()

    r.use(normalizeRequestUrl)

    r.use(health)
    r.use(ready)
    if (enableDiagnosticRoutes) {
        r.use(echo)
        r.use(boom)
    }
    app.use(prefix, r)

    // single slash path for lazy mount
    lazyMount(app, `${prefix}/flickr-info`, async () => {
        const module = await import('./projects/flickrGetInfo/getFlickrInfo.bundle.js')
        return {default: module.createGetFlickrInfoRouter(getFlickrInfoHandler)}
    })
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

    lazyMount(app, `${prefix}/fetch-reddit-flairs`, async () => {
        const module = await import('./projects/redditBelts/getRedditBelts.bundle.js')
        return {default: module.createGetRedditBeltsRouter(getRedditBeltsHandler)}
    })
    // FOR LOCKY JR  ??????
    lazyMount(app, `${prefix}/fetch-flairs`, () => import('./projects/fetchFlairs/fetchFlairs.bundle.js'))

    //RAFL Data Import for preview mode
    lazyMount(app, `${prefix}/refresh-preview`, async () => {
        const module = await import('./projects/importRaflData/importRaflData.bundle.js')
        return {default: module.createImportRaflDataRouter(importRaflDataHandler)}
    })

    lazyMount(app, `${prefix}/log-activity`, async () => {
        const module = await import('./projects/logFirebaseActivity/logFirebaseActivity.bundle.js')
        return {default: module.createFirebaseActivityRouter(firebaseActivityHandler)}
    })
    lazyMount(app, `${prefix}/process-firebase-log`, () => import('./projects/logFirebaseActivity/processFirebaseActivityLog.bundle.js'))

    lazyMount(app, `${prefix}/email-form`, async () => {
        const module = await import('./projects/emailFormContents/emailFormContents.bundle.js')
        return {default: module.createEmailFormRouter(emailFormHandler)}
    })
    app.use([`${prefix}/api`, `/${prefix}/api`], api)
}
