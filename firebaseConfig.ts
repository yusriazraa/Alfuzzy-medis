// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpAaRomGV25fyIEwGyU4UjENlBUtGk6bA",
  authDomain: "alfuzzy-medis.firebaseapp.com",
  projectId: "alfuzzy-medis",
  storageBucket: "alfuzzy-medis.firebasestorage.app",
  messagingSenderId: "1091796433047",
  appId: "1:1091796433047:web:29f3db7454b35da44f91d2",
  measurementId: "G-S845VP6W5P"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
