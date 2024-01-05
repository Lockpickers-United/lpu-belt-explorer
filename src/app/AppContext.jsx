import React, {useCallback, useMemo, useState} from 'react'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const [beta, setBeta] = useState(() => {
        return localStorage.getItem('beta') === 'true'
    })

    const handleSetBeta = useCallback(value => {
        setBeta(value)
        localStorage.setItem('beta', `${value}`)
    }, [])

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
