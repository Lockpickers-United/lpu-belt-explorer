import React, {useCallback, useMemo, useContext} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import dayjs from 'dayjs'
import AuthContext from './AuthContext.jsx'
import {useTheme} from '@mui/material'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BiotechIcon from '@mui/icons-material/Biotech'

const AccessContext = React.createContext({})

const roleLevels = {
    admin: 100,
    lpuMod: 90,
    qaUser: 20
}

export function AccessProvider({children}) {
    const theme = useTheme()

    const {userClaims = []} = useContext(AuthContext)

    const roles = userClaims.reduce((acc, claim) => {
        acc[claim] = true
        return acc
    }, {})

    const [adminEnabled, setAdminEnabled] = useLocalStorage('adminEnabled', roles.admin)

    const [lpuModFlag, setLpuModFlag] = useLocalStorage('lpuModEnabled', '')
    const lpuModEnabled = roles.lpuMod && dayjs().day() === dayjs(lpuModFlag).day()

    const [qaUserFlag, setQaUserFlag] = useLocalStorage('qaUserEnabled', '')
    const qaUserEnabled = roles.qaUser && dayjs().day() === dayjs(qaUserFlag).day()

    const enabledRoles = useMemo(() => {
        return {
            admin: adminEnabled,
            lpuMod: lpuModEnabled,
            qaUser: qaUserEnabled
        }
    }, [adminEnabled, lpuModEnabled, qaUserEnabled])

    const accessInfo = useMemo(() => {
        const enabledRoleLevels = Object.entries(roleLevels).reduce((acc, [role, level]) => {
            if (enabledRoles[role]) {
                acc[role] = level
            }
            return acc
        }, {})
        const maxLevel = Math.max(...Object.values(roleLevels)) || 0
        const maxEnabledLevel = Math.max(...Object.values(enabledRoleLevels)) || 0
        const base = {
            roles,
            enabledRoles,
            level: maxLevel,
            enabledLevel: maxEnabledLevel,
        }

        const palette = theme.palette
        const roleColors = {
            admin: palette.success.main,
            lpuMod: palette.warning.main,
            qaUser: palette.info.main
        }

        if (enabledRoles.admin) {
            return {
                ...base,
                color: adminEnabled ? roleColors.admin : 'inherit',
                icon: <AdminPanelSettingsIcon style={{color: roleColors.admin, marginLeft: 6}}/>
            }
        } else if (enabledRoles.lpuMod) {
            return {
                ...base,
                color: enabledRoles.lpuMod ? roleColors.lpuMod : 'inherit',
                icon: <SportsMartialArtsIcon style={{color: roleColors.lpuMod, marginLeft: 6}}/>
            }
        } else if (enabledRoles.qa) {
            return {
                ...base,
                color: qaUserEnabled ? roleColors.qaUser : 'inherit',
                icon: <BiotechIcon style={{color: roleColors.qaUser, marginLeft: 6}}/>
            }
        }
        return {
            ...base,
            color: 'inherit',
            icon: <></>
        }
    }, [adminEnabled, enabledRoles, qaUserEnabled, roles, theme.palette])

    const _avatarBorderColor = adminEnabled
        ? '#65b642'
        : lpuModEnabled
            ? '#e5a20a'
            : qaUserEnabled
                ? '#5397e0'
                : 'inherit'

    const toggleRoleEnabled = useCallback((role) => {
        if (role === 'admin') {
            if (roles.admin) setAdminEnabled(current => !current)
            else setAdminEnabled(false)
        } else if (role === 'mod') {
            if (roles.lpuMod && !lpuModEnabled) setLpuModFlag(dayjs().format())
            else setLpuModFlag('')
        } else if (role === 'qa') {
            if (roles.qaUser && !qaUserEnabled) setQaUserFlag(dayjs().format())
            else setQaUserFlag('')
        }
    }, [roles.admin, roles.lpuMod, roles.qaUser, setAdminEnabled, lpuModEnabled, setLpuModFlag, qaUserEnabled, setQaUserFlag])

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

export default AccessContext
