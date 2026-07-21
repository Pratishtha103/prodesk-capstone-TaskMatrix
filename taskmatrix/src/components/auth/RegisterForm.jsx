
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/authSlice";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { auth, db } from "@/services/firebase";
import Footer from "@/components/common/Footer";

export default function SignUp() {
  const [formData, setFormData] = useState({
    role: "Member",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
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

        // Determine user role using env variable
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanAdminEmail = (adminEmail || "").trim().toLowerCase();

        console.log("Admin email configured in env:", cleanAdminEmail);
        console.log("Registering email:", cleanEmail);

        const resolvedRole = (cleanAdminEmail && cleanEmail === cleanAdminEmail) ? "Admin" : "Member";
        console.log("Resolved Role:", resolvedRole);

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

        console.log("Firebase user created and stored in Firestore:", userCredential.user);

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
      let msg = "Signup failed. Try again.";
      if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email format.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
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
          <h2 className="text-xl font-medium text-center text-gray-900 mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Username Input */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-100 border-none outline-none focus:ring-2 focus:ring-[#5c54e5]/20 px-3.5 py-2.5 text-gray-650 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
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

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-100 border-none outline-none focus:ring-2 focus:ring-[#5c54e5]/20 pl-3.5 pr-10 py-2.5 text-gray-650 placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-450 hover:text-gray-600 cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
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
              Sign Up
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5 select-none">
            Already have an account? <Link href="/" className="text-[#5c54e5] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}