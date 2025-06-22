// FILE: pages/auth/login.tsx
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ParticlesBg = dynamic(() => import("particles-bg"), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        loginUser({
          name: user.displayName || "No Name",
          email: user.email || "No Email",
          photo: user.photoURL || "",
          isAdmin: user.email === "hemangkrish7@gmail.com",
        })
      );

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticlesBg type="polygon" bg={true} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl max-w-md w-full text-center"
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center animate-spin-slow">
          <span className="text-3xl">📰</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
          News Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-sm">Stay informed. Stay empowered.</p>

        <button
          onClick={handleLogin}
          className="bg-blue-700 hover:bg-blue-800 transition-colors duration-300 text-white px-6 py-3 rounded-lg w-full font-semibold shadow-md"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-xs text-gray-500 italic">
          Admins only can access analytics and payouts
        </p>
      </motion.div>
    </div>
  );
}
