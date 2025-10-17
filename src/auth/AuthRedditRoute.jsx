import React, {useState, useEffect, useContext, useRef} from 'react'
import {lookupAwardByBelt, awardGreaterThan} from '../entries/entryutils'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import ImportPreview from '../scorecard/ImportPreview.jsx'

const idealRegExp = /(white|yellow|orange|green|blue|purple|brown|red|black|(\d\d?)[th\s]*dan|dan[th\s]*(\d\d?))\s*(belt)?\s*(approved|granted)/i
const positiveRegExp = /approved|granted|congrat/i
const beltRegExps = [/white/i, /yellow/i, /orange/i, /green/i, /blue/i, /purple/i, /brown/i, /red/i, /black/i, /(\d\d?)[th\s]*dan/i, /dan[th\s]*(\d\d?)/i]

function AuthRedditRoute() {
    const {getBookmarkForRedditUser, advanceBookmarkForRedditUser, oauthState} = useContext(DBContext)
    const {user} = useContext(AuthContext)
    const {VITE_REDDIT_CLIENT_ID: clientId, VITE_REDDIT_CLIENT_SECRET: clientSecret} = import.meta.env

    const urlMatchCode = window.location.href.match(/\?state=([^&]+)&code=([^#]+)#/)
    let urlState = urlMatchCode ? urlMatchCode[1] : null
    const debugDownload = urlState && urlState.startsWith('DEBUG_DOWNLOAD')
    if (debugDownload) {
        urlState = urlState.slice('DEBUG_DOWNLOAD'.length)
    }
    const urlCode = urlMatchCode ? urlMatchCode[2] : null
    const urlMatchError = window.location.href.match(/\?state=([^&]+)&error=([^#]+)#/)
    const urlError = urlMatchError ? urlMatchError[2] : null

    const [credentials, setCredentials] = useState(null)
    const [syncResult, setSyncResult] = useState({})
    const [syncException, setSyncException] = useState(false)
    const usedCode = useRef(false)

    const syncStatus = syncException || (Object.keys(syncResult).length > 0 ? 'complete' : false)

    useEffect(() => {
        async function getAccessToken(userId) {
            if (await oauthState(userId, urlState)) {
                let resp = null
                try {
                    resp = await fetch('https://www.reddit.com/api/v1/access_token', {
                        method: 'POST',
                        body: new URLSearchParams({
                            grant_type: 'authorization_code',
                            code: encodeURIComponent(urlCode),
                            redirect_uri: `${location.origin}/#/auth/reddit`
                        }).toString(),
                        headers: {
                            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                } catch (_error) {
                    setSyncException('token_failed')
                    return
                }

                if (200 === resp.status) {
                    const data = await resp.json()
                    setCredentials({token: data.access_token, type: data.token_type})
                } else if (404 === resp.status) {
                    setSyncException('token_expired')
                } else {
                    setSyncException('token_failed')
                }
            }
        }

        if (urlCode && urlState && user.uid && !usedCode.current) {
            usedCode.current = true
            getAccessToken(user.uid)
        } else if (urlError) {
            setSyncException('access_denied')
        }
    }, [urlCode, urlState, urlError, user, clientId, clientSecret, oauthState])

    useEffect(() => {
        async function syncRedditBeltAwards(type, token) {
            let username = null
            let flairBelt = null
            let dataError = false

            let userResp = null
            try {
                userResp = await fetch('https://oauth.reddit.com/api/v1/me', {
                    headers: {authorization: `${type} ${token}`}
                })
            } catch (_error) {
                dataError = true
            }
            if (200 === userResp.status) {
                const data = await userResp.json()
                username = data.name
            } else {
                dataError = true
            }
            const bookmark = await getBookmarkForRedditUser(username)

            let flairResp = null
            try {
                flairResp = await fetch('https://oauth.reddit.com/r/lockpicking/api/flairselector', {
                    method: 'POST',
                    headers: {authorization: `${type} ${token}`}
                })
            } catch (_error) {
                dataError = true
            }
            if (200 === flairResp.status) {
                const data = await flairResp.json()
                const flair = data.current.flair_text
                if (flair) {
                    const danMatch = flair.match(/^Black Belt (\d+)th Dan/)
                    const beltMatch = flair.match(/^(\w+) Belt/)
                    if (danMatch) {
                        flairBelt = lookupAwardByBelt(null, danMatch[1])
                    } else if (beltMatch) {
                        flairBelt = lookupAwardByBelt(beltMatch[1], null)
                    }
                }
            } else {
                dataError = true
            }

            const batchSize = 100
            let reachedEndOfStream = false
            let beforeMark = bookmark
            let afterMark = null
            let nextBookmark = null
            let awards = []
            let rawMessages = []

            while (!dataError && !reachedEndOfStream) {
                const beforeParam = beforeMark ? `&before=${beforeMark}` : ''
                const afterParam = afterMark ? `&after=${afterMark}` : ''
                const url = `https://oauth.reddit.com/message/inbox?limit=${batchSize}` + beforeParam + afterParam
                let messageResp = null

                try {
                    messageResp = await fetch(url, {
                        headers: {authorization: `${type} ${token}`}
                    })
                } catch (_error) {
                    dataError = true
                }
                if (200 === messageResp.status) {
                    const respObj = await messageResp.json()
                    const data = respObj.data

                    if (data.children.length > 0) {
                        if (bookmark) {
                            // Paging forwards in time, must update beforeParam.
                            // Within batch, messages appear to go backwards in time.
                            beforeMark = data.children.reduce((acc, msg) => {
                                return !acc.time || msg.data.created_utc > acc.time ? {time: msg.data.created_utc, mark: msg.data.name} : acc
                            }, {}).mark

                            nextBookmark = beforeMark
                        } else {
                            // Paging backwards in time, must update afterParam.
                            // Within batch, messages appear to go backwards in time.
                            afterMark = data.children.reduce((acc, msg) => {
                                return !acc.time || msg.data.created_utc <= acc.time ? {time: msg.data.created_utc, mark: msg.data.name} : acc
                            }, {}).mark

                            if (!nextBookmark) {
                                nextBookmark = data.children[0].data.name
                            }
                        }
                    }
                    if (data.children.length < batchSize) {
                        reachedEndOfStream = true
                    }

                    const newMessages = data.children.filter(msg => msg.kind === 't4' && msg.data.distinguished === 'moderator' && msg.data.subreddit === 'lockpicking')
                    const newAwards = newMessages
                        .map(msg => {
                            let matchId = null
                            const matchedAward = matchToBeltAward(msg.data.subject, msg.data.body)
                            if (matchedAward && !awardGreaterThan(matchedAward, flairBelt)) {
                                matchId = matchedAward.id
                            }
                            let createdAt = new Date(0)
                            createdAt.setUTCSeconds(msg.data.created_utc)
                            return ({
                                matchId: matchId,
                                awardedAt: createdAt.toUTCString(),
                                link: `https://www.reddit.com/message/messages/${msg.data.id}`
                            })
                        })
                        .filter(msg => msg.matchId)

                    rawMessages = [...rawMessages, ...newMessages]
                    awards = [...awards, ...newAwards]
                } else {
                    dataError = true
                }
            }

            if (dataError) {
                setSyncException('data_failed')
            } else if (debugDownload) {
                const messages = rawMessages.map(msg => ({
                    id: msg.data.id,
                    subject: msg.data.subject,
                    created_utc: msg.data.created_utc,
                    body: msg.data.body
                }))

                const b64Chunk = 'data:application/json;base64,' + btoa(JSON.stringify(messages))
                const blob = await (await fetch(b64Chunk)).blob()
                const URL = window.URL.createObjectURL(blob)
                const el = document.createElement('a')
                el.download = 'reddit-modmail-debug.json'
                el.href = URL
                el.click()
                window.URL.revokeObjectURL(URL)

                setSyncException('debug_download')
            } else if (awards.length > 0) {
                const dedupAwards = Object.values(
                    awards.reduce((acc, msg) => {
                        if (!acc[msg.matchId] || new Date(msg.awardedAt) < new Date(acc[msg.matchId].awardedAt)) {
                            acc[msg.matchId] = msg
                        }
                        return acc
                    }, {})
                )
                await advanceBookmarkForRedditUser(username, nextBookmark, dedupAwards)
                setSyncResult({username: username, flair: flairBelt, awards: dedupAwards})
            } else {
                setSyncException('none_found')
            }

            try {
                await fetch('https://www.reddit.com/api/v1/revoke_token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        token: token,
                        token_type_hint: type
                    }).toString(),
                    headers: {
                        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            } catch (_error) {
                // ignore
            }
        }
        if (credentials) {
            syncRedditBeltAwards(credentials.type, credentials.token)
        }
    }, [credentials, advanceBookmarkForRedditUser, getBookmarkForRedditUser, clientId, clientSecret, debugDownload])

    return (

            <ImportPreview syncStatus={syncStatus} syncResult={syncResult} service={'Reddit'}/>

    )
}

function matchToBeltAward(subject, body) {
    const idealMatch = body.match(idealRegExp)
    if (idealMatch) {
        const danLevel = idealMatch[2] || idealMatch[3]
        return lookupAwardByBelt(idealMatch[1], danLevel)
    }
    const positiveMatch = body.match(positiveRegExp)
    if (positiveMatch) {
        let beltMatches = beltRegExps.map(re => body.match(re))
        if (!beltMatches.some(x => !!x)) {
            beltMatches = beltRegExps.map(re => subject.match(re))
        }
        const posBeltMatches = beltMatches.filter(x => !!x)
        if (posBeltMatches.length === 1) {
            return lookupAwardByBelt(posBeltMatches[0][0], posBeltMatches[0][1])
        }
    }
    return null
}

export default AuthRedditRoute
