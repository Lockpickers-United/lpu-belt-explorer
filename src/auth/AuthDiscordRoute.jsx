import React, {useState, useContext, useEffect} from 'react'
import DBContext from '../app/DBContext'
import {getAwardEntryFromId, lookupAwardByBelt} from '../entries/entryutils'

function AuthDiscordRoute() {
    const {setDiscordUserInfo, peekAtDiscordAwards} = useContext(DBContext)
    const {VITE_DISCORD_CLIENT_ID: clientId, VITE_DISCORD_CLIENT_SECRET: clientSecret} = import.meta.env
    const urlMatch = window.location.href.match(/\?code=([^#]+)#/)
    const urlCode = urlMatch ? urlMatch[1] : null

    const [credentials, setCredentials] = useState(null)
    const [syncResult, setSyncResult] = useState({})

    useEffect(() => {
        async function getAccessToken() {
            const resp = await fetch('https://discord.com/api/oauth2/token', {
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
            if (200 === resp.status) {
                const data = await resp.json()
                setCredentials({token: data.access_token, type: data.token_type})
            }
        }
        if (urlCode) {
            getAccessToken()
        }
    }, [urlCode, clientId, clientSecret])

    useEffect(() => {
        async function syncDiscordUsername(type, token) {
            const resp = await fetch('https://discord.com/api/users/@me', {
                headers: {authorization: `${type} ${token}`}
            })
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
                await setDiscordUserInfo(data.id, data.username)
                setSyncResult({id: data.id, username: data.username, awards: awards})
            }
        }
        if (credentials) {
            syncDiscordUsername(credentials.type, credentials.token)
        }
    }, [credentials, setDiscordUserInfo, peekAtDiscordAwards])

    return (
        <React.Fragment>
            <p>
            {syncResult.id} {syncResult.username}
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

export default AuthDiscordRoute
