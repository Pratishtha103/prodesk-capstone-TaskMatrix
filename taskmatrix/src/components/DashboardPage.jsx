"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { clearUser } from "@/redux/features/authSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isAuthReady } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  async function handleLogout() {
    try {
      await signOut(auth);
      dispatch(clearUser());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (!isAuthReady) {
    return <p>Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>UID: {user?.uid}</p>

      <br />

      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}