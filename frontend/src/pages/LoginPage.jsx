import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey } from "react-icons/fa";
import FloatingShape from "../components/FloatingShape";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password); // Get the user including role

      console.log("User data after login:", user);
      
      // Check user role and navigate accordingly
      if (user.role === "admin") {
        navigate("/admindashboard");
      } else if (user.role === "user") {
        navigate("/homepage");
      }
    } catch (err) {
      console.error(err);
    } finally {
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
  initial={{ opacity: 0, scale: 0.9 }}s
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  className="max-w-xl w-full mx-auto p-12 bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700"
>

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="text-white">
            {/* Email Field */}
            <div className="mb-4 flex items-start gap-3">
              <FaEnvelope className="text-green-400 mt-3" />
              <div className="flex flex-col w-full">
                <label htmlFor="email" className="font-semibold mb-1">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white border-2 border-gray-600 rounded-md outline-none w-full py-2 px-3"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 flex items-start gap-3">
              <FaKey className="text-green-400 mt-3" />
              <div className="flex flex-col w-full">
                <label htmlFor="password" className="font-semibold mb-1">Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-white border-2 border-gray-600 rounded-md outline-none w-full py-2 px-3"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>}

            {/* Submit Button */}
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  type="submit"
  className="w-3/4 mx-auto block py-3 px-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
  disabled={loading}
>
  {loading ? "Logging In..." : "Login"}
</motion.button>


            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-300 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:text-green-500 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
