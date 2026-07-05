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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}