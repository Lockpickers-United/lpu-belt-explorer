import React, {useState, useContext, useEffect, useRef} from 'react'
import DBContext from '../app/DBContext'
import {lookupAwardByBelt} from '../entries/entryutils'
import ImportPreview from '../scorecard/ImportPreview.jsx'
import {ProfileProvider} from '../app/ProfileContext.jsx'

function AuthDiscordRoute() {
    const {setDiscordUserInfo, peekAtDiscordAwards} = useContext(DBContext)
    const {VITE_DISCORD_CLIENT_ID: clientId, VITE_DISCORD_CLIENT_SECRET: clientSecret} = import.meta.env
    const searchParams = URL.parse(window.location.href).searchParams
    const urlError = searchParams.get('error')
    const code = searchParams.get('code')
    const iss = searchParams.get('iss')
    const urlCode = iss === 'https://discord.com' ? code : 'failed-to-get-code'

    const [credentials, setCredentials] = useState(null)
    const [syncResult, setSyncResult] = useState({})
    const [syncException, setSyncException] = useState(null)
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

        if (urlError) {
            setSyncException('access_denied')
        } else if (urlCode && !usedCode.current) {
            if (urlCode === 'failed-to-get-code') {
                setSyncException('data_failed')
                return
            }
            usedCode.current = true
            getAccessToken()
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
            if (200 !== resp.status) {
                setSyncException('data_failed')
                return
            }
            try {
                const data = await resp.json()
                const awardDocs = await peekAtDiscordAwards(data.id)
                const awards = awardDocs.map(aw => {
                    const entry = lookupAwardByBelt(aw.discordAwardName.match(/^(\w+) Belt/)?.[1], aw.discordAwardName.match(/^(\d+)/)?.[1], aw.discordAwardName)
                    return entry && {
                        matchId: entry.id,
                        awardedAt: aw.awardCreatedAt.toDate().toUTCString(),
                        link: aw.awardUrl
                    }
                }).filter(Boolean)
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
            } catch (_error) {
                setSyncException('data_failed')
            }
        }

        if (credentials) {
            syncDiscordUsername(credentials.type, credentials.token)
        }
    }, [credentials, setDiscordUserInfo, peekAtDiscordAwards])

    return (
        <ProfileProvider>
            <ImportPreview syncStatus={syncStatus} syncResult={syncResult} service={'Discord'}/>
        </ProfileProvider>
    )
}

export default AuthDiscordRoute
