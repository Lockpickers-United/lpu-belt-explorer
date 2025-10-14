import React, {useState, useContext, useEffect, useRef} from 'react'
import DBContext from '../app/DBContext'
import {lookupAwardByBelt} from '../entries/entryutils'
import ImportPreview from '../scorecard/ImportPreview.jsx'

function AuthDiscordRoute() {
    const {setDiscordUserInfo, peekAtDiscordAwards} = useContext(DBContext)
    const {VITE_DISCORD_CLIENT_ID: clientId, VITE_DISCORD_CLIENT_SECRET: clientSecret} = import.meta.env
    const urlMatchCode = window.location.href.match(/\?code=([^#]+)#/)
    const urlCode = urlMatchCode ? urlMatchCode[1] : null
    const urlMatchError = window.location.href.match(/\?error=([^&]+)&error_description/)
    const urlError = urlMatchError ? urlMatchError[1] : null

    const [credentials, setCredentials] = useState(null)
    const [syncResult, setSyncResult] = useState({})
    const [syncException, setSyncException] = useState(false)
    const usedCode = useRef(false)

    const syncStatus = syncException || (Object.keys(syncResult).length > 0 ? 'complete' : false)

    useEffect(() => {
        async function getAccessToken() {
            let resp = null
            try {
                resp = await fetch('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: urlCode,
                        redirect_uri: `${location.origin}/#/auth/discord`
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
            } else if (400 === resp.status) {
                setSyncException('token_expired')
            } else {
                setSyncException('token_failed')
            }
        }

        if (urlCode && !usedCode.current) {
            usedCode.current = true
            getAccessToken()
        } else if (urlError) {
            setSyncException('access_denied')
        }
    }, [urlCode, urlError, clientId, clientSecret])

    useEffect(() => {
        async function syncDiscordUsername(type, token) {
            let resp = null
            try {
                resp = await fetch('https://discord.com/api/users/@me', {
                    headers: {authorization: `${type} ${token}`}
                })
            } catch (_error) {
                setSyncException('data_failed')
                return
            }
            if (200 === resp.status) {
                const data = await resp.json()
                const awardDocs = await peekAtDiscordAwards(data.id)
                const awards = awardDocs.map(aw => {
                    const entry = lookupAwardByBelt(aw.discordAwardName.match(/^(\w+) Belt/)?.[1], aw.discordAwardName.match(/^(\d+)/)?.[1], aw.discordAwardName)
                    return {
                        matchId: entry.id,
                        awardedAt: aw.awardCreatedAt.toDate().toUTCString(),
                        link: aw.awardUrl
                    }
                })
                if (awards.length > 0) {
                    const dedupAwards = Object.values(
                        awards.reduce((acc, msg) => {
                            if (!acc[msg.matchId] || new Date(msg.awardedAt) < new Date(acc[msg.matchId].awardedAt)) {
                                acc[msg.matchId] = msg
                            }
                            return acc
                        }, {})
                    )
                    await setDiscordUserInfo(data.id, data.username)
                    setSyncResult({id: data.id, username: data.username, awards: dedupAwards})
                } else {
                    setSyncException('none_found')
                }
            } else {
                setSyncException('data_failed')
            }
        }

        if (credentials) {
            syncDiscordUsername(credentials.type, credentials.token)
        }
    }, [credentials, setDiscordUserInfo, peekAtDiscordAwards])

    return (

            <ImportPreview syncStatus={syncStatus} syncResult={syncResult} service={'Discord'}/>

    )
}

export default AuthDiscordRoute
