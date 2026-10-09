import React, {useContext} from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import AuthContext from './AuthContext.jsx'
import {useAccess} from './AccessContext.jsx'
import {useUI} from './UIContext.jsx'
import LoadingDisplayNav from '../nav/LoadingDisplayNav'

// TODO: add access by level

export default function RequireRoles({roles = [], profileRoles = [], children}) {
    const {authLoaded} = useContext(AuthContext)
    const {accessInfo} = useAccess()
    const {profileLoaded, profileRoles: availableProfileRoles} = useUI()

    if (!authLoaded) return <LoadingDisplayNav/>

    const hasClaimRole = roles.some(role => accessInfo.roles[role])
    if (!hasClaimRole && profileRoles.length && !profileLoaded) {
        return <LoadingDisplayNav/>
    }

    if (!hasClaimRole && !profileRoles.some(role => availableProfileRoles[role])) {
        return <Navigate to='/locks' replace/>
    }

    return children ?? <Outlet/>
}
