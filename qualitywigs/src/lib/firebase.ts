import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAJVSVDF4L-V42pJyu2Ch6xyABtSZB5ESM",
    authDomain: "qualitywigs-a6a31.firebaseapp.com",
    projectId: "qualitywigs-a6a31",
    storageBucket: "qualitywigs-a6a31.firebasestorage.app",
    messagingSenderId: "23701237520",
    appId: "1:23701237520:web:46763c2a784628d897bf95",
    measurementId: "G-SZ26CV5PRT"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app) 