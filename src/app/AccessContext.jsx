import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import dayjs from 'dayjs'
import AuthContext from './AuthContext.jsx'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BiotechIcon from '@mui/icons-material/Biotech'

const AccessContext = React.createContext(undefined)

const roleLevels = {
    admin: 100,
    lpuMod: 90,
    requestAdmin: 85,
    qaUser: 20
}

const emptyRoles = {
    admin: false,
    lpuMod: false,
    requestAdmin: false,
    qaUser: false
}

const roleIcons = {
    admin: <AdminPanelSettingsIcon color='success' style={{marginLeft: 6}}/>,
    lpuMod: <SportsMartialArtsIcon color='warning' style={{marginLeft: 6}}/>,
    qaUser: <BiotechIcon color='info' style={{marginLeft: 6}}/>
}

const getHighestRoleLevel = roles => Math.max(
    0,
    ...Object.entries(roleLevels)
        .filter(([role]) => roles[role])
        .map(([, level]) => level)
)

const getActiveRole = enabledRoles => Object.entries(roleLevels)
    .filter(([role]) => enabledRoles[role])
    .sort(([, firstLevel], [, secondLevel]) => secondLevel - firstLevel)[0]?.[0] || null

const isEnabledToday = enabledAt => {
    const enabledDate = dayjs(enabledAt)
    return enabledDate.isValid() && enabledDate.isSame(dayjs(), 'day')
}

export function AccessProvider({children}) {
    const {authLoaded, isLoggedIn, user, userClaims = []} = useContext(AuthContext)
    const [adminPreference, setAdminPreference] = useLocalStorage('adminEnabled', false)
    const [lpuModEnabledAt, setLpuModEnabledAt] = useLocalStorage('lpuModEnabled', '')
    const [qaUserEnabledAt, setQaUserEnabledAt] = useLocalStorage('qaUserEnabledAt', '')
    const [, setExpirationTick] = useState(0)

    const roles = useMemo(() => {
        if (!authLoaded || !isLoggedIn || !user?.uid) return emptyRoles

        const claims = new Set(userClaims)
        return {
            admin: claims.has('admin'),
            lpuMod: claims.has('lpuMod'),
            requestAdmin: claims.has('requestAdmin'),
            // Administrators retain the previous ability to preview QA-only UI.
            qaUser: claims.has('qaUser') || claims.has('admin')
        }
    }, [authLoaded, isLoggedIn, user?.uid, userClaims])

    const adminEnabled = roles.admin && adminPreference === true
    const requestAdminEnabled = roles.requestAdmin
    const lpuModEnabled = roles.lpuMod && isEnabledToday(lpuModEnabledAt)
    const qaUserEnabled = roles.qaUser && isEnabledToday(qaUserEnabledAt)

    const enabledRoles = useMemo(() => ({
        admin: adminEnabled,
        lpuMod: lpuModEnabled,
        requestAdmin: requestAdminEnabled,
        qaUser: qaUserEnabled
    }), [adminEnabled, lpuModEnabled, qaUserEnabled, requestAdminEnabled])

    const dailyRoleExpiration = useMemo(() => {
        if (!enabledRoles.lpuMod && !enabledRoles.qaUser) return null
        return Math.max(0, dayjs().endOf('day').diff(dayjs()) + 1)
    }, [enabledRoles.lpuMod, enabledRoles.qaUser])

    useEffect(() => {
        if (dailyRoleExpiration === null) return undefined

        const timeout = window.setTimeout(() => {
            setExpirationTick(current => current + 1)
        }, dailyRoleExpiration)
        return () => window.clearTimeout(timeout)
    }, [dailyRoleExpiration])

    const accessInfo = useMemo(() => ({
        roles,
        enabledRoles,
        level: getHighestRoleLevel(roles),
        enabledLevel: getHighestRoleLevel(enabledRoles),
        activeRole: getActiveRole(enabledRoles),
        icon: roleIcons[getActiveRole(enabledRoles)] || null
    }), [enabledRoles, roles])

    const toggleRoleEnabled = useCallback(role => {
        if (role === 'admin') {
            setAdminPreference(current => roles.admin && current !== true)
        } else if (role === 'lpuMod') {
            setLpuModEnabledAt(roles.lpuMod && !enabledRoles.lpuMod ? dayjs().toISOString() : '')
        } else if (role === 'qaUser') {
            setQaUserEnabledAt(roles.qaUser && !enabledRoles.qaUser ? dayjs().toISOString() : '')
        }
    }, [enabledRoles.lpuMod, enabledRoles.qaUser, roles.admin, roles.lpuMod, roles.qaUser, setAdminPreference, setLpuModEnabledAt, setQaUserEnabledAt])

    const value = useMemo(() => ({
        accessInfo,
        toggleRoleEnabled
    }), [accessInfo, toggleRoleEnabled])

    return (
        <AccessContext.Provider value={value}>
            {children}
        </AccessContext.Provider>
    )
}

export function useAccess() {
    const value = useContext(AccessContext)
    if (!value) {
        throw new Error('useAccess must be used within an AccessProvider')
    }
    return value
}

export default AccessContext
