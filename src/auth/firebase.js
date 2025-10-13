import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

export const {VITE_DEV_FIRESTORE: devFirestore} = import.meta.env
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// Firebase configuration
let firebaseConfig

firebaseConfig = {
    apiKey: apiKey,
    authDomain: 'lpu-belt-explorer.firebaseapp.com',
    projectId: 'lpu-belt-explorer',
    storageBucket: 'lpu-belt-explorer.appspot.com',
    messagingSenderId: '1004257270920',
    appId: '1:1004257270920:web:ba605e14f98e926a1e533d'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = devFirestore==='true' ? getFirestore(app, 'lpubelts-dev') : getFirestore(app)
