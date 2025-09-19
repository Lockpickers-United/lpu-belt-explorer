import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
import {auth} from '../auth/firebase'

const AuthContext = React.createContext({})

export function AuthProvider({children}) {
    const [user, setUser] = useState({})
    const [userClaims, setUserClaims] = useState([])
    const [authLoaded, setAuthLoaded] = useState(false)
    const [initialUser, setInitialUser] = useState(null)

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            setAuthLoaded(true)
            setUser(user)
            auth.currentUser?.getIdTokenResult()
                .then(idTokenResult => {
                    setUserClaims(Object.keys(idTokenResult.claims)
                        .filter(claim => idTokenResult.claims[claim] === true)
                        .filter(claim => claim !== 'email_verified'))
                })
                .catch(error => {
                    console.error('Error getting token result:', error)
                })
        })
        return () => unregisterAuthObserver()
    }, [])

    const login = useCallback(() => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})
        return signInWithPopup(auth, provider)
    }, [])

    useEffect(() => {
        if (authLoaded && !initialUser && Object.keys(user || {}).length > 0) {
            setInitialUser('yes')
        } else if (authLoaded && !initialUser && Object.keys(user || {}).length === 0) {
            setInitialUser('no')
        }
    }, [authLoaded, initialUser, user])

    const logout = useCallback(() => {
        setInitialUser('no')
        setUser({})
        return signOut(auth)
    }, [])

    const value = useMemo(() => ({
        authLoaded,
        isLoggedIn: !!user?.uid,
        user,
        userClaims,
        login,
        logout,
        initialUser,
        setInitialUser
    }), [authLoaded, login, logout, user, userClaims, initialUser, setInitialUser])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
