import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {production} from '../data/serverEnv'

// Firebase configuration
let firebaseConfig

firebaseConfig = {
    apiKey: 'AIzaSyDGGErdOp0lpzUumA60xJO7BlQr027y9Vo',
    authDomain: 'lpu-belt-explorer.firebaseapp.com',
    projectId: 'lpu-belt-explorer',
    storageBucket: 'lpu-belt-explorer.appspot.com',
    messagingSenderId: '1004257270920',
    appId: '1:1004257270920:web:ba605e14f98e926a1e533d'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app, production ? '(default)' : 'lpubelts-dev')
