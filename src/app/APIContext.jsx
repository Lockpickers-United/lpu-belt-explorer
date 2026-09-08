import React, {useCallback, useContext, useMemo} from 'react'
import {apiServerUrl} from '../data/dataUrls'
import profileDB2State from './profileDB2State'
import AuthContext from './AuthContext.jsx'
import {getData} from '../formUtils/getData.jsx'

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
            const {displayName, collections = {}} = response?.data || {}
            return profileDB2State({
                ...collections,
                recordedLocks: collections.scorecard || [],
                displayName
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


    const value = useMemo(() => ({
        fetchProfileSummary,
        fetchProfileFull
    }), [fetchProfileFull,
        fetchProfileSummary
    ])

    return (
        <APIContext.Provider value={value}>
            {children}
        </APIContext.Provider>
    )
}

export default APIContext
