"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { auth, db } from "@/services/firebase";
import { setUser } from "@/redux/features/authSlice";
import Footer from "@/components/common/Footer";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

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
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { role, email, password } = formData;

    if (!role || !email || !password) {
      toast.error("Please fill all fields.");
      return;
    }

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
      let msg = "Login failed. Try again.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email format.";
      }
      toast.error(msg);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white font-sans">
      {/* Top Header */}
      <div className="w-full flex items-center justify-center gap-2 p-3.5 border-b border-secondary">
          <img src="/Logo.png" alt="TaskMatrix Logo" className="w-7 h-7 object-contain" />
          <h1 className="text-xl font-semibold text-primary">TaskMatrix</h1>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-88 sm:max-w-96 bg-white border border-gray-200/60 rounded-xl p-6 sm:p-7 shadow-sm">
          <h2 className="text-xl font-medium text-center text-gray-900 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Select */}
            <div className="relative">
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-100 border-none outline-none focus:ring-2 focus:ring-[#5c54e5]/20 px-3.5 py-2.5 text-gray-650 placeholder-gray-400 text-sm appearance-none cursor-pointer"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Username/Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Username"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-100 border-none outline-none focus:ring-2 focus:ring-[#5c54e5]/20 px-3.5 py-2.5 text-gray-650 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-100 border-none outline-none focus:ring-2 focus:ring-[#5c54e5]/20 pl-3.5 pr-10 py-2.5 text-gray-650 placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-450 hover:text-gray-600 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>

            <button 
              type="submit" 
              className="bg-[#5c54e5] hover:bg-[#4d45d0] text-white font-medium rounded-lg px-10 py-2.5 text-sm transition-colors shadow-sm cursor-pointer block mx-auto mt-5"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5 select-none">
            Are you a new user? <Link href="/register" className="text-[#5c54e5] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}