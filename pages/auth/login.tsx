// FILE: pages/auth/login.tsx

import { auth, provider } from "../../lib/firebase";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";


const ParticlesBg = dynamic(() => import("particles-bg"), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleEmailLogin = async () => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    dispatch(
      loginUser({
        name: user.displayName || "Admin",
        email: user.email || "No Email",
        photo: "", // No photo in email/pass
        isAdmin: user.email === "makhu4002@gmail.com", // Your public admin
      })
    );
    router.push("/dashboard");
  } catch (err) {
    console.error("Email Login error", err);
    alert("Email login failed. Check credentials.");
  }
};


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
        <div className="mb-4">
  <input
    type="email"
    placeholder="Email"
    className="w-full px-4 py-2 border rounded mb-2"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    type="password"
    placeholder="Password"
    className="w-full px-4 py-2 border rounded mb-4"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button
    onClick={handleEmailLogin}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full font-semibold mb-3"
  >
    Sign in with Email
  </button>
</div>

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
