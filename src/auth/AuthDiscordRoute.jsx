import React, {useState, useContext, useEffect} from 'react'
import DBContext from '../app/DBContext'

function AuthDiscordRoute() {
    const {setDiscordUserInfo} = useContext(DBContext)
    const {VITE_DISCORD_CLIENT_ID: clientId, VITE_DISCORD_CLIENT_SECRET: clientSecret} = import.meta.env
    const urlMatch = window.location.href.match(/auth\/discord\?code=([^#]+)#/)
    const urlCode = urlMatch ? urlMatch[1] : null

    const [credentials, setCredentials] = useState(null)
    const [discordInfo, setDiscordInfo] = useState({})

    useEffect(() => {
        async function getAccessToken() {
            const hostname = location.host.startsWith('localhost') ? 'dev.lpubelts.com' : location.host
            const resp = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: urlCode,
                    redirect_uri: `https://${hostname}/auth/discord`
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
                await setDiscordUserInfo(data.id, data.username)
                setDiscordInfo({id: data.id, username: data.username})
            }
        }
        if (credentials) {
            syncDiscordUsername(credentials.type, credentials.token)
        }
    }, [credentials, setDiscordUserInfo])

    return (
        <p>
        {discordInfo.id} {discordInfo.username}
        </p>
    )
}

export default AuthDiscordRoute
