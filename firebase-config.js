// -------------------------
// Firebase Initialization
// -------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    getDoc,
    doc,
    updateDoc,
    setDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --------------------------------------------------
// Your Firebase Project Configuration (Using YOUR KEY)
// --------------------------------------------------

export const firebaseConfig = {
    apiKey: "AIzaSyBT_lez6PGgXURC4fMm6DAo3rMeM7INCwQ",
    authDomain: "simple-voting-system-bf383.firebaseapp.com",
    projectId: "simple-voting-system-bf383",
    storageBucket: "simple-voting-system-bf383.firebasestorage.app",
    messagingSenderId: "461497530556",
    appId: "1:461497530556:web:0708726b68fcc3f8a9b8b9",
    measurementId: "G-M6DN9YYBMW"
};

// ------------------------
// Initialize Firebase
// ------------------------

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// ------------------------
// Initialize Services
// ------------------------

export const auth = getAuth(app);
export const db = getFirestore(app);
