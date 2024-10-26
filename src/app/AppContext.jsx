import React, {useCallback, useMemo, useContext, useEffect} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import DBContext from './DBContext'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {adminRole} = useContext(DBContext)
    const [beta, setBeta] = useLocalStorage('beta2024', false)
    const [admin, setAdmin] = useLocalStorage('admin', adminRole && !!import.meta.env.DEV)

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

    const value = useMemo(() => ({
        beta,
        setBeta: handleSetBeta,
        admin,
        setAdmin: handleSetAdmin
    }), [beta, handleSetBeta, admin, handleSetAdmin])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
