import React, {useContext, useMemo} from 'react'
import AuthContext from './AuthContext.jsx'
import DBContext from './DBContext.jsx'

const UIContext = React.createContext(undefined)

export function UIProvider({children}) {
    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const {lockCollection, profileUserId} = useContext(DBContext)
    const profileLoaded = authLoaded && (!isLoggedIn || profileUserId === user?.uid)

    const value = useMemo(() => ({
        profileLoaded,
        profileRoles: {
            blackBelt: profileLoaded && isLoggedIn && lockCollection?.blackBeltAwardedAt > 0
        }
    }), [isLoggedIn, lockCollection?.blackBeltAwardedAt, profileLoaded])

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    )
}

export function useUI() {
    const value = useContext(UIContext)
    if (!value) {
        throw new Error('useUI must be used within an UIProvider')
    }
    return value
}

export default UIContext
