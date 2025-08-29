import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments, FaPaperPlane, FaTimes, FaArrowLeft, FaStar } from "react-icons/fa";
import FloatingShape from "../components/FloatingShape";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserUpdateFeedback() {
  const [feedback, setFeedback] = useState({
    subject: "",
    message: "",
    rating: 0, // Add rating to feedback state
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [messageError, setMessageError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-feedbacks/${id}`);
      setFeedback(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch feedback");
      setLoading(false);
      toast.error("Error loading feedback");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.subject || !feedback.message) {
      toast.error("Please fill in all fields");
      return;
    }

    if (feedback.message.length > 500) {
      setMessageError("Message cannot exceed 500 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(`${API_URL}/${id}`, feedback);
      toast.success("Feedback updated successfully!");
      navigate("/feedback/my-feedbacks");
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Error updating feedback"}`);
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error updating feedback. Please check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getSubjectStyles = (type) => {
    const baseStyles = "relative flex-1 p-4 text-center rounded-lg transition-all duration-200 cursor-pointer";
    const selectedStyles = {
      "Positive feedback": "bg-green-900/50 text-green-400 border-2 border-green-500",
      "Negative feedback": "bg-red-900/50 text-red-400 border-2 border-red-500",
      "Suggestion": "bg-blue-900/50 text-blue-400 border-2 border-blue-500",
    };
    const unselectedStyles = "bg-gray-800/50 text-gray-400 border-2 border-transparent hover:bg-gray-700/50";

    return `${baseStyles} ${feedback.subject === type ? selectedStyles[type] : unselectedStyles}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-red-400">
        <p className="text-lg mb-3">{error}</p>
        <button
          onClick={fetchFeedback}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold">Update Feedback</h1>
              <p className="text-green-100 mt-1">Edit your feedback details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Feedback Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Positive feedback", "Negative feedback", "Suggestion"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFeedback((prev) => ({ ...prev, subject: type }))}
                  className={getSubjectStyles(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Your Message</label>
            <textarea
              value={feedback.message}
              onChange={(e) => setFeedback((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full p-3 bg-gray-900 text-gray-300 rounded-lg border border-gray-800 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 transition duration-200 placeholder-gray-600"
              rows={4}
              placeholder="Enter your feedback message..."
            />
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
                  onClick={() => setFeedback((prev) => ({ ...prev, rating: star }))}
                  className={`text-2xl transition duration-200 ${
                    star <= feedback.rating ? "text-yellow-400" : "text-gray-500"
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
              disabled={submitting}
              className={`flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg transition-all duration-200 ${
                submitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-green-600 transform hover:scale-105"
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Update Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default UserUpdateFeedback;