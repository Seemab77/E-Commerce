// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // page-level loading
  const [error, setError] = useState("");

  // keep user in sync
  useEffect(() => {
    const off = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    return () => off();
  }, []);

  // create user + profile doc
  const signUp = async (email, password, name) => {
    setError("");
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Email and password must be strings.");
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // optional but nice: set displayName
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }

    // create user doc if not exists
    const ref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: cred.user.uid,
        name: name || "",
        email,
        createdAt: serverTimestamp(),
      });
    }
    return cred.user;
  };

  const signIn = async (email, password) => {
    setError("");
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    setError("");
    const { user } = await signInWithPopup(auth, googleProvider);
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        createdAt: serverTimestamp(),
      });
    }
    return user;
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const value = { user, loading, error, signUp, signIn, signInWithGoogle, logOut, setError };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
