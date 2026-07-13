"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { auth, db } from "@/services/firebase";
import {
  setUser,
  clearUser,
  setAuthReady,
} from "@/redux/features/authSlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDocSnap = await getDoc(doc(db, "users", user.uid));
            let role = "Member";
            if (userDocSnap.exists()) {
              role = userDocSnap.data().role || "Member";
            }
            dispatch(
              setUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName || "User",
                role: role,
              })
            );
          } catch (err) {
            console.error("Error fetching user profile from Firestore:", err);
            dispatch(
              setUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName || "User",
                role: "Member",
              })
            );
          }
        } else {
          dispatch(clearUser());
        }

        dispatch(setAuthReady(true));
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("AuthProvider: Error during onAuthStateChanged subscription:", error);
    }
  }, [dispatch]);

  return <>{children}</>;
}