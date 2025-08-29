import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments, FaPaperPlane, FaTimes, FaStar, FaArrowLeft } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import FloatingShape from "../components/FloatingShape";

axios.defaults.withCredentials = true;

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/feedback"
    : "/api/feedback";

function UserAddFeedback() {
  const { user } = useAuthStore();
  const [subject, setSubject] = useState("Positive feedback");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMessageChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 500) {
      setMessage(inputValue);
      setMessageError("");
    } else {
      setMessageError("Message cannot exceed 500 characters.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit feedback.");
      return;
    }

    if (!subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_URL, {
        subject,
        message,
        rating,
      });

      if (response.status === 201) {
        toast.success("Thank you for your feedback!");
        setSubject("Positive feedback");
        setMessage("");
        setRating(0);
        navigate("/feedback/my-feedbacks");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Error submitting feedback."}`
        );
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error submitting feedback. Please check your connection.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectStyles = (type) => {
    const baseStyles =
      "relative flex-1 p-4 text-center rounded-lg transition-all duration-200 cursor-pointer";
    const selectedStyles = {
      "Positive feedback":
        "bg-green-100 text-green-700 border-2 border-green-400",
      "Negative feedback":
        "bg-red-100 text-red-700 border-2 border-red-400",
      "Suggestion":
        "bg-blue-100 text-blue-700 border-2 border-blue-400",
    };
    const unselectedStyles =
      "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200";

    return `${baseStyles} ${
      subject === type ? selectedStyles[type] : unselectedStyles
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <FaComments className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Share Your Feedback</h1>
              <p className="text-green-100 mt-1">We value your opinion and want to hear from you!</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Your Name</label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Your Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Feedback Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Positive feedback", "Negative feedback", "Suggestion"].map((type) => (
                <motion.button
                  key={type}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSubject(type)}
                  className={getSubjectStyles(type)}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Your Message</label>
            <div className="relative">
              <textarea
                value={message}
                onChange={handleMessageChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[150px] resize-none text-gray-300"
                placeholder="Share your thoughts with us..."
                required
              />
              {message && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMessage("")}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
                >
                  <FaTimes />
                </motion.button>
              )}
            </div>
            <p className="text-sm text-gray-500 text-right">
              {message.length}/500 characters
            </p>
            {messageError && (
              <p className="text-sm text-red-400">{messageError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition duration-200 ${
                    star <= rating ? "text-yellow-400" : "text-gray-500"
                  } hover:text-yellow-300`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Link
              to="/feedback/my-feedbacks"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all transform hover:scale-105"
            >
              <FaArrowLeft />
              <span>Back to My Feedbacks</span>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg transition-all duration-200 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-green-600 transform hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default UserAddFeedback;
