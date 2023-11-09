import React, {useEffect, useMemo, useState} from 'react'
import {initializeApp} from 'firebase/app'
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDGGErdOp0lpzUumA60xJO7BlQr027y9Vo',
    authDomain: 'lpu-belt-explorer.firebaseapp.com',
    projectId: 'lpu-belt-explorer',
    storageBucket: 'lpu-belt-explorer.appspot.com',
    messagingSenderId: '1004257270920',
    appId: '1:1004257270920:web:ba605e14f98e926a1e533d'
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const provider = new GoogleAuthProvider()
provider.setCustomParameters({prompt: 'select_account'})

const AuthContext = React.createContext({})

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            setUser(user)
        })
        return () => unregisterAuthObserver()
    }, [])

    const value = useMemo(() => ({
        isLoggedIn: !!user,
        user,
        login: () => signInWithPopup(auth, provider),
        logout: () => signOut(auth)
    }), [user])

    console.log(value)
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
