import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
import {auth} from '../auth/firebase'

const AuthContext = React.createContext({})

export function AuthProvider({children}) {
    const [user, setUser] = useState({})
    const [authLoaded, setAuthLoaded] = useState(false)

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            setAuthLoaded(true)
            setUser(user)
        })
        return () => unregisterAuthObserver()
    }, [])

    const login = useCallback(() => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})
        return signInWithPopup(auth, provider)
    }, [])

    const logout = useCallback(() => {
        return signOut(auth)
    }, [])

    const value = useMemo(() => ({
        authLoaded,
        isLoggedIn: !!user?.uid,
        user,
        login,
        logout
    }), [authLoaded, login, logout, user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
