const minute = 60_000
const tenMinutes = 10 * minute

function policy({name, windowMs, max, penaltyMs = 30_000}) {
    return Object.freeze({
        name,
        windowMs,
        max,
        penaltyMs,
        maxPenaltyMs: 120_000,
        maxRetryAfterMs: 20 * minute
    })
}

export const rateLimitPolicies = Object.freeze({
    baseline: policy({
        name: 'server-baseline',
        windowMs: minute,
        max: 300,
        penaltyMs: 10_000
    }),
    userProfiles: policy({
        name: 'api-users',
        windowMs: minute,
        max: 60
    }),
    collectionStats: policy({
        name: 'collection-stats',
        windowMs: minute,
        max: 120
    }),
    requestLock: policy({
        name: 'request-lock',
        windowMs: tenMinutes,
        max: 10
    }),
    updateRequest: policy({
        name: 'update-request',
        windowMs: minute,
        max: 30
    }),
    requestVote: policy({
        name: 'request-vote',
        windowMs: minute,
        max: 60
    }),
    uploadContent: policy({
        name: 'upload-content',
        windowMs: tenMinutes,
        max: 5
    }),
    emailForm: policy({
        name: 'email-form',
        windowMs: tenMinutes,
        max: 5
    }),
    importRaflData: policy({
        name: 'import-rafl-data',
        windowMs: tenMinutes,
        max: 3
    }),
    redditBelts: policy({
        name: 'reddit-belts',
        windowMs: tenMinutes,
        max: 3
    }),
    flickrInfo: policy({
        name: 'flickr-info',
        windowMs: minute,
        max: 20
    }),
    firebaseActivity: policy({
        name: 'firebase-activity',
        windowMs: minute,
        max: 120
    })
})

export const userProfileRateLimitConfig = rateLimitPolicies.userProfiles
