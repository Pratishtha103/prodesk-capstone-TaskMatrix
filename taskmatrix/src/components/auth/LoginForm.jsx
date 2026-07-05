"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "@/services/firebase";
import { setUser } from "@/redux/features/authSlice";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { role, email, password } = formData;

    if (!role || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
        })
      );

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email.");
      } else {
        setError("Login failed. Try again.");
      }
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Login</button>
      </form>

      <p>
        New User? <Link href="/register">Sign Up</Link>
      </p>
    </div>
  );
}