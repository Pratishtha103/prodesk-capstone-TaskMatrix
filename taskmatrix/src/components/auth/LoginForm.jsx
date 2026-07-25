"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { toast } from "react-hot-toast";
import { auth, db } from "@/services/firebase";
import { setUser } from "@/redux/features/authSlice";
import Footer from "@/components/common/Footer";
import { useTheme } from "@/contexts/ThemeContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const { isAuthenticated, isAuthReady } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthReady, isAuthenticated, router]);

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
    if (!formData.role) {
      tempErrors.role = "Please select a role.";
    }
    if (!formData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const { role, email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Fetch user profile from Firestore to check their registered role
      const userDocSnap = await getDoc(doc(db, "users", user.uid));
      let dbRole = "Member";
      let dbName = "User";
      if (userDocSnap.exists()) {
        dbRole = userDocSnap.data().role || "Member";
        dbName = userDocSnap.data().username || userDocSnap.data().name || user.displayName || "User";
      } else {
        dbName = user.displayName || "User";
      }

      if (dbRole !== role) {
        await signOut(auth);
        setErrors({
          role: "Invalid role selection for this account.",
        });
        toast.error("Invalid role selection for this account.");
        return;
      }

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          name: dbName,
          role: dbRole,
        })
      );

      toast.success("Login successful");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setErrors({
          email: "Invalid email or password.",
          password: "Invalid email or password.",
        });
        toast.error("Invalid email or password.");
      } else if (err.code === "auth/invalid-email") {
        setErrors({
          email: "Invalid email format.",
        });
        toast.error("Invalid email format.");
      } else {
        toast.error("Login failed. Try again.");
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
          <h2 className="text-xl font-medium text-center text-text-main mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Select */}
            <div>
              <div className="relative">
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className={`w-full rounded-lg bg-surface-muted border outline-none focus:ring-2 focus:ring-indigo-500/50 px-3.5 py-2.5 text-text-main placeholder-text-muted text-sm appearance-none cursor-pointer ${
                    errors.role ? "border-red-500 focus:ring-red-500/20" : "border-transparent"
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-text-muted">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.role && (
                <p className="text-xs text-red-500 mt-1 pl-1">{errors.role}</p>
              )}
            </div>

            {/* Username/Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Username"
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

            <button 
              type="submit" 
              className="bg-[#5c54e5] hover:bg-[#4d45d0] text-white font-medium rounded-lg px-10 py-2.5 text-sm transition-colors shadow-sm cursor-pointer block mx-auto mt-5"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-5 select-none">
            Are you a new user? <Link href="/register" className="text-[#5c54e5] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}