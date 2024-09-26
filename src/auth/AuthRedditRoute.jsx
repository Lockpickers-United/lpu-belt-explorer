import React, {useState, useEffect, useContext} from 'react'
import {getAwardEntryFromId, lookupAwardByBelt, awardGreaterThan} from '../entries/entryutils'
import DBContext from '../app/DBContext'

const idealRegExp = /(white|yellow|orange|green|blue|purple|brown|red|black|(\d\d?)[th\s]*dan|dan[th\s]*(\d\d?))\s*(belt)?\s*(approved|granted)/i
const positiveRegExp = /approved|granted|congrat/i
const beltRegExps = [/white/i, /yellow/i, /orange/i, /green/i, /blue/i, /purple/i, /brown/i, /red/i, /black/i, /(\d\d?)[th\s]*dan/i, /dan[th\s]*(\d\d?)/i]

function AuthRedditRoute() {
    const {getBookmarkForRedditUser, advanceBookmarkForRedditUser, oauthState} = useContext(DBContext)
    const {VITE_REDDIT_CLIENT_ID: clientId, VITE_REDDIT_CLIENT_SECRET: clientSecret} = import.meta.env

    const urlMatch = window.location.href.match(/\?state=([^&]+)&code=([^#]+)#/)
    const urlState = urlMatch ? urlMatch[1] : null
    const urlCode = urlMatch ? urlMatch[2] : null

    const [credentials, setCredentials] = useState(null)
    const [syncResult, setSyncResult] = useState({})

    useEffect(() => {
        async function getAccessToken() {
            if (await oauthState(urlState)) {
                const resp = await fetch('https://www.reddit.com/api/v1/access_token', {
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
                if (200 === resp.status) {
                    const data = await resp.json()
                    setCredentials({token: data.access_token, type: data.token_type})
                }
            }
        }
        if (urlCode && urlState) {
            getAccessToken()
        }
    }, [urlCode, urlState, clientId, clientSecret, oauthState])

    useEffect(() => {
        async function syncRedditBeltAwards(type, token) {
            let username = null
            let flairBelt = null

            const userResp = await fetch('https://oauth.reddit.com/api/v1/me', {
                headers: {authorization: `${type} ${token}`}
            })
            if (200 === userResp.status) {
                const data = await userResp.json()
                username = data.name
            }
            const bookmark = await getBookmarkForRedditUser(username)

            const flairResp = await fetch('https://oauth.reddit.com/r/lockpicking/api/flairselector', {
                method: 'POST',
                headers: {authorization: `${type} ${token}`}
            })
            if (200 === flairResp.status) {
                const data = await flairResp.json()
                const flair = data.current.flair_text
                const danMatch = flair.match(/^Black Belt (\d+)th Dan/)
                const beltMatch = flair.match(/^(\w+) Belt/)
                if (danMatch) {
                    flairBelt = lookupAwardByBelt(null, danMatch[1])
                } else if (beltMatch) {
                    flairBelt = lookupAwardByBelt(beltMatch[1], null)
                }
            }

            const beforeParam = bookmark ? `&before=${bookmark}` : ''
            let reachedEndOfStream = false
            let afterMark = null
            let nextBookmark = null
            let awards = []

            while (!reachedEndOfStream) {
                const afterParam = afterMark ? `&after=${afterMark}` : ''
                const url = 'https://oauth.reddit.com/message/inbox?limit=100' + beforeParam + afterParam
                const messageResp = await fetch(url, {
                    headers: {authorization: `${type} ${token}`}
                })
                if (200 === messageResp.status) {
                    const respObj = await messageResp.json()
                    const data = respObj.data
                    afterMark = data.after

                    if (!afterMark || data.children.length === 0) {
                        reachedEndOfStream = true
                    }
                    if (!nextBookmark && data.children.length > 0) {
                        nextBookmark = data.children[0].data.name
                    }

                    const newAwards = data.children
                        .filter(msg => msg.kind === 't4' && msg.data.distinguished === 'moderator' && msg.data.subreddit === 'lockpicking')
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

                    awards = [...awards, ...newAwards]
                } else {
                    reachedEndOfStream = true
                }
            }
            await advanceBookmarkForRedditUser(username, nextBookmark, awards)
            setSyncResult({username: username, flair: flairBelt, awards: awards})

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
        }
        if (credentials) {
            syncRedditBeltAwards(credentials.type, credentials.token)
        }
    }, [credentials, advanceBookmarkForRedditUser, getBookmarkForRedditUser, clientId, clientSecret])

    return (
        <React.Fragment>
            <p>
            {syncResult.username} : {syncResult.flair?.name}
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Award</th>
                        <th>AwardedAt</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {syncResult.awards?.map(msg =>
                        <tr key={msg.matchId}>
                            <td>{getAwardEntryFromId(msg.matchId).name}</td>
                            <td>{msg.awardedAt}</td>
                            <td>{msg.link}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </React.Fragment>
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
