import React, {useContext} from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import AuthContext from './AuthContext.jsx'
import {useAccess} from './AccessContext.jsx'
import LoadingDisplayNav from '../nav/LoadingDisplayNav'

// TODO: add access by level

export default function RequireRoles({roles = [], children}) {
    const {authLoaded} = useContext(AuthContext)
    const {accessInfo} = useAccess()

    if (!authLoaded) return <LoadingDisplayNav/>

    if (!roles.some(role => accessInfo.roles[role])) {
        return <Navigate to='/locks' replace/>
    }

    return children ?? <Outlet/>
}