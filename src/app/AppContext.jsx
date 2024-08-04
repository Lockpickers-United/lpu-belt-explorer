import React, {useCallback, useContext, useMemo} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import AuthContext from './AuthContext'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {user} = useContext(AuthContext)
    const [beta, setBeta] = useLocalStorage('beta', true)

    const handleSetBeta = useCallback(value => {
        setBeta(value)
    }, [setBeta])

    const value = useMemo(() => ({
        beta,
        setBeta: handleSetBeta
    }), [beta, handleSetBeta])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
