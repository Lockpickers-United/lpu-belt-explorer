import React, {useMemo, useState} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const [beta, setBeta] = useState(false)
    useHotkeys('ctrl+shift+m', () => setBeta(!beta))

    const value = useMemo(() => ({
        beta,
    }), [beta])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
