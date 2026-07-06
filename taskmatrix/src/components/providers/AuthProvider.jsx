"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "@/services/firebase";
import {
  setUser,
  clearUser,
  setAuthReady,
} from "@/redux/features/authSlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("AuthProvider: Initializing onAuthStateChanged. Firebase API Key present:", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("AuthProvider: onAuthStateChanged event fired. User:", user);
        if (user) {
          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              name: user.displayName || "User",
            })
          );
        } else {
          dispatch(clearUser());
        }

        dispatch(setAuthReady(true));
      });

      return () => {
        console.log("AuthProvider: Unsubscribing from auth state listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("AuthProvider: Error during onAuthStateChanged subscription:", error);
    }
  }, [dispatch]);

  return <>{children}</>;
}