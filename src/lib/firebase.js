// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Compatibility: Vite or CRA
const ENV = (typeof import.meta !== "undefined" && import.meta.env) || process.env;

const firebaseConfig = {
  apiKey:
    ENV?.VITE_FIREBASE_API_KEY || ENV?.REACT_APP_FIREBASE_API_KEY,
  authDomain:
    ENV?.VITE_FIREBASE_AUTH_DOMAIN || ENV?.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:
    ENV?.VITE_FIREBASE_PROJECT_ID || ENV?.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:
    ENV?.VITE_FIREBASE_STORAGE_BUCKET || ENV?.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    ENV?.VITE_FIREBASE_MESSAGING_SENDER_ID || ENV?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    ENV?.VITE_FIREBASE_APP_ID || ENV?.REACT_APP_FIREBASE_APP_ID,
  measurementId:
    ENV?.VITE_FIREBASE_MEASUREMENT_ID || ENV?.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  // Helpful error if env didn't load
  // eslint-disable-next-line no-console
  console.error(
    "[Firebase] Missing env vars. Did you create .env.local at project root and restart the dev server?"
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
