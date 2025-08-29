import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import FloatingShape from "../components/FloatingShape";

function Profile() {
  const { user, updateUser, logout, deleteUser } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    toast.custom((t) => (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
        <h3 className="text-xl font-bold mb-4">Confirm Update</h3>
        <p className="text-gray-400 mb-6">Are you sure you want to update your profile?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setLoading(false);
            }}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const updatedData = {
                  name,
                  email,
                  ...(password && { password }),
                };
                await updateUser(updatedData);
                toast.success("Profile updated successfully!");
                setTimeout(() => navigate("/dashboard"), 1000);
              } catch (error) {
                toast.error("Error updating profile");
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden px-4">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl p-12 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-300 text-lg">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                disabled
                className="w-full px-4 py-3 border-b-2 border-gray-500 bg-transparent text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border-b-2 border-gray-500 bg-transparent text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border-b-2 border-gray-500 bg-transparent text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border-b-2 border-gray-500 bg-transparent text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Updating..." : "Save Changes"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() =>
                toast.custom((t) => (
                  <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
                    <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                    <p className="text-gray-400 mb-6">Are you sure you want to delete your account? This action is irreversible.</p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          toast.dismiss(t.id);
                          try {
                            setLoading(true);
                            await deleteUser(); // CALL deleteUser here
                            toast.success("Account Deleted");
                            setTimeout(() => navigate("/signup"), 1000);
                          } catch (error) {
                            toast.error("Failed to delete account");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ))
              }
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
            >
              Delete Account
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Profile;
