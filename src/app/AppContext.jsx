import React, {useCallback, useMemo, useContext, useEffect, useState} from 'react'
import {useEffectOnce, useInterval, useLocalStorage} from 'usehooks-ts'
import DBContext from './DBContext'
import dayjs from 'dayjs'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {adminRole, qaUserRole} = useContext(DBContext)
    const [beta, setBeta] = useLocalStorage('beta2024', false)
    const [admin, setAdmin] = useLocalStorage('admin', adminRole && !!import.meta.env.DEV)
    const [qaUser, setQaUser] = useLocalStorage('qaUser', qaUserRole && !!import.meta.env.DEV)

    const [compact, setCompact] = useState(false)

    useEffect(() => {
        if (!adminRole && admin) {
            setAdmin(false)
        }
        if (!qaUserRole && qaUser) {
            setQaUser(false)
        }
    }, [adminRole, admin, setAdmin, qaUserRole, qaUser, setQaUser])

    const handleSetBeta = useCallback(value => {
        setBeta(value)
    }, [setBeta])

    const handleSetAdmin = useCallback(value => {
        if (adminRole) {
            setAdmin(value)
        } else {
            setAdmin(false)
        }
    }, [setAdmin, adminRole])

    const handleSetQaUser = useCallback(value => {
        if (qaUserRole) {
            setQaUser(value)
        } else {
            setQaUser(false)
        }
    }, [qaUserRole, setQaUser])

    const [initial, setInitial] = useState()
    const [version, setVersion] = useState()
    const [initalMinVersion, setInitialMinVersion] = useState()
    const [updateRequired, setUpdateRequired] = useState(false)
    const [error, setError] = useState(false)
    const updateAvailable = initial && version && initial !== version

    const checkVersion = async first => {
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
    }

    const multiplier = 60 // set to 1 for testing, 60 for production

    useEffectOnce(() => {
        checkVersion(true).then()
    })
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
        admin,
        setAdmin: handleSetAdmin,
        qaUser,
        setQaUser: handleSetQaUser,
        version: initial,
        updateRequired,
        updateAvailable,
        compact, setCompact,
    }), [beta, handleSetBeta, admin, handleSetAdmin, qaUser, handleSetQaUser, initial, updateRequired, updateAvailable, compact])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
