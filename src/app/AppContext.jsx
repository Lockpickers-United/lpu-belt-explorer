import React, {useCallback, useMemo, useContext, useEffect, useState} from 'react'
import {useInterval, useLocalStorage} from 'usehooks-ts'
import DBContext from './DBContext'
import dayjs from 'dayjs'
import AuthContext from './AuthContext.jsx'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {authLoaded, isLoggedIn, user, userClaims} = useContext(AuthContext)
    const {adminRole, qaUserRole} = useContext(DBContext)
    const [beta, setBeta] = useLocalStorage('beta2024', false)
    const [adminEnabled, setAdminEnabled] = useLocalStorage('adminEnabled', adminRole && !!import.meta.env.DEV)
    const [qaUserEnabled, setQaUserEnabled] = useLocalStorage('qaUserEnabled', qaUserRole && !!import.meta.env.DEV)

    const isLpuMod = authLoaded && isLoggedIn && user && (['lpuMod'].some(claim => userClaims.includes(claim)))
    const [modFlag, setModFlag] = useLocalStorage('modEnabled', '')
    const modEnabled = isLpuMod && dayjs().day() === dayjs(modFlag).day()

    const [compact, setCompact] = useState(false)

    const handleSetBeta = useCallback(value => {
        setBeta(value)
    }, [setBeta])

    const handleSetAdminEnabled = useCallback(value => {
        if (adminRole) setAdminEnabled(value)
        else setAdminEnabled(false)
    }, [setAdminEnabled, adminRole])

    const toggleModEnabled = useCallback(() => {
        if (isLpuMod && modFlag === '') {
            setModFlag(dayjs().format())
        }
        else setModFlag('')
    }, [isLpuMod, modFlag, setModFlag])

    const handleSetQaUserEnabled = useCallback(value => {
        if (qaUserRole) {
            setQaUserEnabled(value)
        } else {
            setQaUserEnabled(false)
        }
    }, [qaUserRole, setQaUserEnabled])

    const [initial, setInitial] = useState()
    const [version, setVersion] = useState()
    const [versionChecked, setVersionChecked] = useState(false)
    const [initalMinVersion, setInitialMinVersion] = useState()
    const [updateRequired, setUpdateRequired] = useState(false)
    const [error, setError] = useState(false)
    const updateAvailable = initial && version && initial !== version

    const checkVersion = useCallback(async first => {
        try {
            const response = await fetch('/version.json', {cache: 'no-cache'})
            const {version: newVersion, minVersion} = (await response.json())

            if (first) {
                setInitial(newVersion)
                setInitialMinVersion(minVersion)
            } else if (version !== newVersion || minVersion !== initalMinVersion) {
                setVersion(newVersion)
                setInitialMinVersion(minVersion)
            }
        } catch (e) {
            console.warn('Unable to check version.', e)
            setError(true)
        }
    },[initalMinVersion, version])

    const multiplier = 60 // set to 1 for testing, 60 for production

    useEffect(() => {
        if (!versionChecked) {
            checkVersion(true).then()
            setVersionChecked(true)
        }
    },[]) // eslint-disable-line

    useInterval(checkVersion, 10 * multiplier * 1000) // 10 * 60 * 1000 = 10 minutes

    if (!error
        && (initial && version && initalMinVersion
            && dayjs(initial) < dayjs(version)
            && dayjs(initial) < dayjs(initalMinVersion))

    ) {
        setTimeout(() => {
            setUpdateRequired(true)
        }, multiplier * 1000) // 60 * 1000 = 1 min
    }

    const value = useMemo(() => ({
        beta,
        setBeta: handleSetBeta,
        adminEnabled,
        setAdminEnabled: handleSetAdminEnabled,
        isLpuMod,
        modEnabled,
        toggleModEnabled,
        qaUserEnabled,
        setQaUserEnabled: handleSetQaUserEnabled,
        version: initial,
        updateRequired,
        updateAvailable,
        compact, setCompact,
    }), [beta, handleSetBeta, adminEnabled, handleSetAdminEnabled, isLpuMod, modEnabled, toggleModEnabled, qaUserEnabled, handleSetQaUserEnabled, initial, updateRequired, updateAvailable, compact])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
