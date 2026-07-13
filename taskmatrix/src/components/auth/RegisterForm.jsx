
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

export default function SignUp() {
  const [formData, setFormData] = useState({
    role: "Member",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

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

    const { role, username, email, password, confirmPassword } = formData;

    if (!role || !username || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Update auth displayName profile field
        await updateProfile(userCredential.user, {
            displayName: username,
        });

        // Store user profile details and role in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            username,
            email,
            role,
        });

        console.log("Firebase user created and stored in Firestore:", userCredential.user);

        setSuccess("Account created successfully! Redirecting to login...");

        setFormData({
            role: "Member",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

        setTimeout(() => {
            router.push("/login");
        }, 1500);
    } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered.");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else {
                setError("Signup failed. Try again.");
            }
        }
    }

  return (
    <div>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>

        <br /><br />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </div>
  );
}