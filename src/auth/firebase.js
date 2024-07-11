import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const DEV = true

// Firebase configuration
let firebaseConfig

if (DEV) {
    firebaseConfig = {
        apiKey: "AIzaSyCRLpx7RSvQOY4C-gahF5PYXuOYM1T74j8",
        authDomain: "dev-lpu-belt-explorer.firebaseapp.com",
        projectId: "dev-lpu-belt-explorer",
        storageBucket: "dev-lpu-belt-explorer.appspot.com",
        messagingSenderId: "470911408275",
        appId: "1:470911408275:web:19af4877212fb25bf11566",
        measurementId: "G-P33GZJRNBK"
    }
} else {
    firebaseConfig = {
        apiKey: 'AIzaSyDGGErdOp0lpzUumA60xJO7BlQr027y9Vo',
        authDomain: 'lpu-belt-explorer.firebaseapp.com',
        projectId: 'lpu-belt-explorer',
        storageBucket: 'lpu-belt-explorer.appspot.com',
        messagingSenderId: '1004257270920',
        appId: '1:1004257270920:web:ba605e14f98e926a1e533d'
    }
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
