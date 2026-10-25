import React, {useContext, useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'
import APIContext from '../app/APIContext.jsx'
import DBContext from '../app/DBContext.jsx'
import {lookupAwardByBelt} from '../entries/entryutils'
import ImportPreview from '../scorecard/ImportPreview.jsx'
import {ProfileProvider} from '../app/ProfileContext.jsx'
import {
    clearDiscordAuthSession, clearDiscordCallbackQuery, peekDiscordAuthSession, storeDiscordPostingGrant,
    takeDiscordAuthNonce
} from './discordAuth.js'

function mapAwards(awardDocs) {
    const awards = awardDocs.map(award => {
        const entry = lookupAwardByBelt(
            award.discordAwardName.match(/^(\w+) Belt/)?.[1],
            award.discordAwardName.match(/^(\d+)/)?.[1],
            award.discordAwardName
        )
        return entry && {
            matchId: entry.id,
            awardedAt: award.awardCreatedAt.toDate().toUTCString(),
            link: award.awardUrl
        }
    }).filter(Boolean)
    return Object.values(awards.reduce((result, award) => {
        if (!result[award.matchId] ||
            new Date(award.awardedAt) < new Date(result[award.matchId].awardedAt)) {
            result[award.matchId] = award
        }
        return result
    }, {}))
}

function AuthDiscordRoute() {
    const {authLoaded, user} = useContext(AuthContext)
    const {exchangeDiscordOAuth} = useContext(APIContext)
    const {setDiscordUserInfo, peekAtDiscordAwards} = useContext(DBContext)
    const navigate = useNavigate()
    const params = new URL(window.location.href).searchParams
    const code = params.get('code')
    const state = params.get('state')
    const issuer = params.get('iss')
    const urlError = params.get('error')
    const pending = peekDiscordAuthSession()
    const pendingBeltRequest = pending?.purpose === 'beltRequest' && pending?.returnTo === '/beltRequests'
    const [syncResult, setSyncResult] = useState(null)
    const [syncException, setSyncException] = useState(null)
    const usedCode = useRef(false)

    useEffect(() => {
        if (!authLoaded || usedCode.current) return
        usedCode.current = true
        clearDiscordCallbackQuery()

        const showError = (status, beltMessage) => {
            if (pendingBeltRequest) {
                navigate('/beltRequests', {replace: true, state: {discordAuthError: beltMessage}})
            } else {
                setSyncException(status)
            }
        }

        if (urlError) {
            clearDiscordAuthSession()
            showError('access_denied', 'Discord authorization was canceled. Your request draft is still available.')
            return
        }
        if (!user?.uid || !code || !state || (issuer && issuer !== 'https://discord.com')) {
            showError('data_failed', 'Discord authorization could not be completed. Please try again.')
            return
        }
        const nonce = takeDiscordAuthNonce(state)
        if (!nonce) {
            showError('data_failed', 'Discord authorization could not be completed. Please try again.')
            return
        }

        async function completeDiscordAuth() {
            try {
                const result = await exchangeDiscordOAuth({code, state, nonce})
                if (result.purpose === 'beltRequest' && result.returnTo === '/beltRequests'
                    && result.postingGrant) {
                    storeDiscordPostingGrant(result.postingGrant, user.uid)
                    navigate(result.returnTo, {replace: true, state: {discordAutoPost: true}})
                    return
                }
                if (result.purpose !== 'import') throw new Error('Invalid Discord auth purpose')

                const {discordId, username} = result.identity
                await setDiscordUserInfo(discordId, username)
                const awardDocs = await peekAtDiscordAwards(discordId)
                setSyncResult({id: discordId, username, awards: mapAwards(awardDocs)})
            } catch (error) {
                if (error.code === 'discord_state_expired') {
                    showError('token_expired', 'Discord authorization expired. Please try again.')
                } else if (error.code === 'discord_exchange_failed') {
                    showError('token_failed', 'Discord authorization failed. Please try again.')
                } else {
                    showError('data_failed', 'Discord authorization could not be completed. Please try again.')
                }
            }
        }
        completeDiscordAuth()
    }, [authLoaded, code, state, issuer, urlError, user, pendingBeltRequest, exchangeDiscordOAuth,
        setDiscordUserInfo, peekAtDiscordAwards, navigate])

    const syncStatus = syncException || (syncResult ? 'complete' : false)

    return (
        <ProfileProvider>
            <ImportPreview syncStatus={syncStatus} syncResult={syncResult || {}} service={'Discord'}/>
        </ProfileProvider>
    )
}

export default AuthDiscordRoute
