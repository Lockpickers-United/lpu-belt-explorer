import React, {useCallback, useContext, useMemo} from 'react'
import {apiServerUrl} from '../data/dataUrls'
import profileDB2State from './profileDB2State'
import AuthContext from './AuthContext.jsx'
import {getData} from '../formUtils/getData.jsx'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import axios from 'axios'
dayjs.extend(utc)

const APIContext = React.createContext({})

export function APIProvider({children}) {
    const {user} = useContext(AuthContext)

    const fetchProfileSummary = useCallback(async (userId) => {
        const url = `${apiServerUrl}/api/v1/users/${encodeURIComponent(userId)}/summary`
        try {
            const response = await getData({
                url,
                snackBars: false,
                timeoutDuration: 10000
            })
            const {displayName, collections = {}, blackBeltAwardedAt, danLevel} = response?.data || {}
            return profileDB2State({
                ...collections,
                recordedLocks: collections.scorecard || [],
                displayName,
                blackBeltAwardedAt,
                danLevel
            })
        } catch (e) {
            console.error('fetchProfileSummary error', e)
            throw e
        }
    }, [])

    const fetchProfileFull = useCallback(async (userId) => {
        const url = `${apiServerUrl}/api/v1/users/${encodeURIComponent(userId)}/profile`
        try {
            const response = await getData({
                user,
                url,
                snackBars: false,
                timeoutDuration: 10000
            })
            return profileDB2State(response?.data?.profile)
        } catch (e) {
            console.error('fetchProfileFull error', e)
            throw e
        }
    }, [user])

    const fetchClassification = useCallback(async (path, params) => {
        const response = await getData({
            user,
            url: `${apiServerUrl}/api/v1/classification/${path}`,
            json: params,
            snackBars: false,
            timeoutDuration: 10000,
            cacheBust: false
        })
        return response.data
    }, [user])

    const fetchClassificationEntryVotes = useCallback((entryId, cursor) =>
        fetchClassification(`entries/${encodeURIComponent(entryId)}/votes`, {limit: 100, ...(cursor && {cursor})}),
    [fetchClassification])
    const fetchClassificationAction = useCallback(entryId =>
        fetchClassification(`entries/${encodeURIComponent(entryId)}/action`), [fetchClassification])
    const fetchClassificationStaged = useCallback(() =>
        fetchClassification('actions/staged', {limit: 100}), [fetchClassification])
    const fetchClassificationPublications = useCallback(cursor =>
        fetchClassification('publications', {limit: 100, ...(cursor && {cursor})}), [fetchClassification])
    const fetchClassificationPublication = useCallback(id =>
        fetchClassification(`publications/${encodeURIComponent(id)}`), [fetchClassification])

    const classificationCommand = useCallback(async (method, path, body, idempotencyKey) => {
        const token = await user.getIdToken()
        try {
            const response = await axios({
                method,
                url: `${apiServerUrl}/api/v1/classification/${path}`,
                data: body,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Idempotency-Key': idempotencyKey
                },
                timeout: 15000
            })
            return response.data.data
        } catch (error) {
            const message = error.response?.data?.error?.message ?? error.message
            throw Object.assign(new Error(message), {
                status: error.response?.status,
                code: error.response?.data?.error?.code,
                recovery: error.response?.data?.error?.recovery
            })
        }
    }, [user])


    const value = useMemo(() => ({
        fetchProfileSummary,
        fetchProfileFull,
        fetchClassificationEntryVotes,
        fetchClassificationAction,
        fetchClassificationStaged,
        fetchClassificationPublications,
        fetchClassificationPublication,
        classificationCommand
    }), [fetchProfileFull,
        fetchProfileSummary, fetchClassificationEntryVotes, fetchClassificationAction,
        fetchClassificationStaged, fetchClassificationPublications, fetchClassificationPublication,
        classificationCommand
    ])

    return (
        <APIContext.Provider value={value}>
            {children}
        </APIContext.Provider>
    )
}

export default APIContext
