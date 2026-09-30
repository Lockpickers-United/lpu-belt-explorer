import React, {useCallback, useMemo, useContext} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import DBContext from './DBContext'
import dayjs from 'dayjs'
import AuthContext from './AuthContext.jsx'
import {useTheme} from '@mui/material'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BiotechIcon from '@mui/icons-material/Biotech'

const AccessContext = React.createContext({})

export function AccessProvider({children}) {
    const theme = useTheme()

    const {authLoaded, isLoggedIn, user, userClaims} = useContext(AuthContext)
    const {adminRole, qaUserRole} = useContext(DBContext)
    const [adminEnabled, setAdminEnabled] = useLocalStorage('adminEnabled', adminRole && !!import.meta.env.DEV)

    const isLpuMod = authLoaded && isLoggedIn && user && (['lpuMod'].some(claim => userClaims.includes(claim)))
    const [modFlag, setModFlag] = useLocalStorage('modEnabled', '')
    const modEnabled = isLpuMod && dayjs().day() === dayjs(modFlag).day()

    const [qaUserEnabled, setQaUserEnabled] = useLocalStorage('qaUserEnabled', qaUserRole && !!import.meta.env.DEV)
    const [beta, setBeta] = useLocalStorage('beta2024', false)

    const roleColors = {
        admin: theme.palette.success.main,
        mod: theme.palette.warning.main,
        qa: theme.palette.info.main
    }

    const accessInfo = useMemo(() => {
        if (adminEnabled) {
            return {
                level: 100,
                color: roleColors.admin,
                icon: <AdminPanelSettingsIcon style={{color: roleColors.admin, marginLeft: 6}}/>

            }
        } else if (modEnabled) {
            return {
                level: 90,
                color: roleColors.mod,
                icon: <SportsMartialArtsIcon style={{color: roleColors.mod, marginLeft: 6}}/>
            }
        } else if (qaUserEnabled) {
            return {
                level: 20,
                color: roleColors.qa,
                icon: <BiotechIcon style={{color: roleColors.qa, marginLeft: 6}}/>
            }
        }
        return {
            level: 0,
            color: 'inherit',
            icon: <></>
        }
    }, [adminEnabled, modEnabled, qaUserEnabled, roleColors.admin, roleColors.mod, roleColors.qa])

    const _avatarBorderColor = adminEnabled
        ? '#65b642'
        : modEnabled
            ? '#e5a20a'
            : qaUserEnabled
                ? '#5397e0'
                : 'inherit'


    const handleSetBeta = useCallback(value => {
        setBeta(value)
    }, [setBeta])

    const handleSetAdminEnabled = useCallback(value => {
        if (adminRole) setAdminEnabled(value)
        else setAdminEnabled(false)
    }, [setAdminEnabled, adminRole])

    const toggleModEnabled = useCallback(() => {
        if (isLpuMod && !modEnabled) {
            setModFlag(dayjs().format())
        } else setModFlag('')
    }, [isLpuMod, modEnabled, setModFlag])

    const handleSetQaUserEnabled = useCallback(value => {
        if (qaUserRole) {
            setQaUserEnabled(value)
        } else {
            setQaUserEnabled(false)
        }
    }, [qaUserRole, setQaUserEnabled])

    const value = useMemo(() => ({
        accessInfo,
        beta,
        setBeta: handleSetBeta,
        adminEnabled,
        setAdminEnabled: handleSetAdminEnabled,
        isLpuMod,
        modEnabled,
        toggleModEnabled,
        qaUserEnabled,
        setQaUserEnabled: handleSetQaUserEnabled
    }), [accessInfo, beta, handleSetBeta, adminEnabled, handleSetAdminEnabled, isLpuMod, modEnabled, toggleModEnabled, qaUserEnabled, handleSetQaUserEnabled])

    return (
        <AccessContext.Provider value={value}>
            {children}
        </AccessContext.Provider>
    )
}

export default AccessContext
