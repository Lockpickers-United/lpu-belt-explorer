import {useCallback, useContext} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import useData from '../util/useData.jsx'

export default function GetUserAndProfile() {
    const {authLoaded} = useContext(AuthContext)
    const {adminRole} = useContext(DBContext)
    const {user} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)
    const userId = user ? user.uid : null
    const loadFn = useCallback(async () => {
        if (!userId) return null
        try {
            return await getProfile(userId)
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, userId])
    const {data = {}, loading, error} = useData({loadFn})
    const profile = data

    return {authLoaded, adminRole, profile, user, loading, error}

}