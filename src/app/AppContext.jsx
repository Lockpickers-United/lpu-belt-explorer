import React, {useCallback, useMemo, useContext} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import DBContext from './DBContext'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {adminRole} = useContext(DBContext)
    const [beta, setBeta] = useLocalStorage('beta', true)
    const [admin, setAdmin] = useLocalStorage('admin', false)

    const handleSetBeta = useCallback(value => {
        setBeta(value)
    }, [setBeta])

    const handleSetAdmin = useCallback(value => {
        if (adminRole) {
            setAdmin(value)
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
