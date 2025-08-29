import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import FloatingShape from "../components/FloatingShape";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = () => {
    navigate("/profileUpdate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating background shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full mx-auto mt-10 p-10 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Profile
        </h2>

        <div className="space-y-8">
          {/* Profile Information */}
          <motion.div
            className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <FaUser className="mr-2 text-green-400" /> Profile Information
            </h3>
            <p className="text-gray-300 text-lg"><span className="font-semibold">Name:</span> {user.name}</p>
            <p className="text-gray-300 text-lg"><span className="font-semibold">Email:</span> {user.email}</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateProfile}
                className="w-full py-3 px-4 bg-green-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-green-600
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Update Profile
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Account Activity */}
          <motion.div
            className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-green-400 mb-4">Account Activity</h3>
            <p className="text-gray-300 text-lg">
              <span className="font-bold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-300 text-lg">
              <span className="font-bold">Last Login:</span> {formatDate(user.lastLogin)}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
