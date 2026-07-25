"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/authSlice";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "react-hot-toast";
import { auth, db } from "@/services/firebase";
import Footer from "@/components/common/Footer";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    role: "Member",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function validate() {
    const tempErrors = {};
    if (!formData.username.trim()) {
      tempErrors.username = "Username is required.";
    }
    if (!formData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const { username, email, password } = formData;

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

        // Determine user role using env variable
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanAdminEmail = (adminEmail || "").trim().toLowerCase();

        const resolvedRole = (cleanAdminEmail && cleanEmail === cleanAdminEmail) ? "Admin" : "Member";

        // Store user profile details and role in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            username,
            email: cleanEmail,
            role: resolvedRole,
        });

        dispatch(
          setUser({
            uid: userCredential.user.uid,
            email: cleanEmail,
            name: username,
            role: resolvedRole,
          })
        );

        toast.success("Account created successfully");

        setFormData({
            role: "Member",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

        setTimeout(() => {
            router.push("/");
        }, 1500);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErrors({
          email: "This email is already registered.",
        });
        toast.error("This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        setErrors({
          email: "Invalid email format.",
        });
        toast.error("Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        setErrors({
          password: "Password should be at least 6 characters.",
        });
        toast.error("Password should be at least 6 characters.");
      } else {
        toast.error("Signup failed. Try again.");
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background font-sans">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between p-3.5 border-b border-secondary bg-surface shrink-0">
        <div className="w-8" />
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="TaskMatrix Logo" className="w-7 h-7 object-contain" />
          <h1 className="text-xl font-semibold text-primary">TaskMatrix</h1>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface-muted hover:text-text-main transition-colors cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-88 sm:max-w-96 bg-surface border border-secondary rounded-xl p-6 sm:p-7 shadow-sm">
          <h2 className="text-xl font-medium text-center text-text-main mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username Input */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full rounded-lg bg-surface-muted border outline-none focus:ring-2 focus:ring-indigo-500/50 px-3.5 py-2.5 text-text-main placeholder-text-muted text-sm ${
                  errors.username ? "border-red-500 focus:ring-red-500/20" : "border-transparent"
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1 pl-1">{errors.username}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg bg-surface-muted border outline-none focus:ring-2 focus:ring-indigo-500/50 px-3.5 py-2.5 text-text-main placeholder-text-muted text-sm ${
                  errors.email ? "border-red-500 focus:ring-red-500/20" : "border-transparent"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 pl-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg bg-surface-muted border outline-none focus:ring-2 focus:ring-indigo-500/50 pl-3.5 pr-10 py-2.5 text-text-main placeholder-text-muted text-sm ${
                    errors.password ? "border-red-500 focus:ring-red-500/20" : "border-transparent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-text-main cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 pl-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-lg bg-surface-muted border outline-none focus:ring-2 focus:ring-indigo-500/50 pl-3.5 pr-10 py-2.5 text-text-main placeholder-text-muted text-sm ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500/20" : "border-transparent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-text-main cursor-pointer"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 pl-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button 
              type="submit" 
              className="bg-[#5c54e5] hover:bg-[#4d45d0] text-white font-medium rounded-lg px-10 py-2.5 text-sm transition-colors shadow-sm cursor-pointer block mx-auto mt-5"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-5 select-none">
            Already have an account? <Link href="/" className="text-[#5c54e5] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}