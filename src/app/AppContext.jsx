import React, {useCallback, useMemo, useContext, useEffect, useState} from 'react'
import {useEffectOnce, useInterval, useLocalStorage} from 'usehooks-ts'
import DBContext from './DBContext'
import dayjs from 'dayjs'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {adminRole} = useContext(DBContext)
    const [beta, setBeta] = useLocalStorage('beta2024', false)
    const [admin, setAdmin] = useLocalStorage('admin', adminRole && !!import.meta.env.DEV)

    const [compact, setCompact] = useState(false)
    const [preview, setPreview] = useLocalStorage('previewMode', false)

    useEffect(() => {
        if (!adminRole && admin) {
            setAdmin(false)
        }
    }, [adminRole, admin, setAdmin])

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

            //if (!/\d{4}-\d\d-\d\d/.test(newVersion)) setUpdateRequired(true) //check for old version format

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
        updateRequired,
        updateAvailable,
        compact, setCompact,
        preview, setPreview
    }), [beta, handleSetBeta, admin, handleSetAdmin, compact, setCompact, preview, setPreview, updateRequired, updateAvailable])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
