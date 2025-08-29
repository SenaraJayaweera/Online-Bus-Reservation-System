import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import FloatingShape from "../components/FloatingShape";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, error } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    setPasswordError("");
    try {
      await signup(email, password, name); 
      navigate("/login");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating Shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      
      <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  className="max-w-xl w-full mx-auto p-12 bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700"
>

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Sign Up
        </h2>

        <form onSubmit={handleSignUp}>
          <div className="text-gray-100">
            {/* Name & Email Fields in One Row */}
            <div className="mb-4 flex gap-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="name" className="font-semibold mb-1">Full Name:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent text-white border border-gray-600 rounded-md outline-none w-full py-2 px-3"
                  placeholder="Enter full name"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label htmlFor="email" className="font-semibold mb-1">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white border border-gray-600 rounded-md outline-none w-full py-2 px-3"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password & Confirm Password Fields in One Row */}
            <div className="mb-4 flex gap-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="password" className="font-semibold mb-1">Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-white border border-gray-600 rounded-md outline-none w-full py-2 px-3"
                  placeholder="Enter password"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label htmlFor="confirmPassword" className="font-semibold mb-1">Confirm Password:</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent text-white border border-dotted border-gray-600 rounded-md outline-none w-full py-2 px-3"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Password Strength Meter */}
            <PasswordStrengthMeter password={password} />

            {/* Errors */}
            {passwordError && <p className="text-red-500 font-semibold text-sm mt-2">{passwordError}</p>}
            {error && <p className="text-red-500 font-semibold text-sm mt-2">{error}</p>}

            {/* Submit Button */}
            <div className="mt-6 flex flex-col gap-3 items-center">
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  type="submit"
  className="w-3/4 mx-auto py-3 px-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
  disabled={loading}
>
  {loading ? "Signing Up..." : "Sign Up"}
</motion.button>



              {/* Login Redirect */}
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-green-400 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
